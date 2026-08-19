import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Hardcoded recipient - NEVER accept from request body
const COMPANY_EMAIL = "information@cesiumcyber.com";

// Only our own pages may call this function. Bots that POST straight at the
// function URL send no Origin (or a foreign one) and are rejected here.
const ALLOWED_ORIGINS = [
  "https://cesiumcyber.com",
  "https://www.cesiumcyber.com",
];

// Any loopback port, so local dev works whichever port Vite settles on.
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const isAllowedOrigin = (origin: string | null): origin is string =>
  !!origin && (ALLOWED_ORIGINS.includes(origin) || LOCALHOST_ORIGIN.test(origin));

// Rate limiting constants
const MAX_ATTEMPTS_PER_HOUR = 3;
const BLOCK_DURATION_MS = 3600000; // 1 hour

// Anti-bot thresholds
const MIN_FILL_MS = 3000; // a human cannot complete the form faster than this
const MAX_FILL_MS = 6 * 3600000; // 6h - anything older is a stale/replayed payload
const SPAM_SCORE_THRESHOLD = 2;

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  leadSource?: string;
  serviceInterest?: string;
  expectedCloseDate?: string;
  // Anti-bot fields supplied by useFormShield on the client
  hpWebsite?: string;
  elapsedMs?: number;
}

const corsFor = (origin: string | null) => {
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
};

/**
 * A client can prepend its own X-Forwarded-For, so the FIRST entry is
 * attacker-controlled and useless for rate limiting. Prefer cf-connecting-ip
 * (set by the edge and not forgeable from outside), and otherwise take the
 * LAST XFF entry, which is the one appended by the closest trusted proxy.
 */
const clientIpFrom = (req: Request) => {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
};

/**
 * Content heuristics. Each hit adds to a score; SPAM_SCORE_THRESHOLD or more
 * means we drop the submission. Scored rather than hard-failed so a single
 * quirk in a genuine message never blocks a real prospect.
 */
const spamScore = (name: string, email: string, company: string, message: string) => {
  const reasons: string[] = [];
  let score = 0;
  const hit = (weight: number, reason: string) => {
    score += weight;
    reasons.push(reason);
  };

  const haystack = `${name} ${company} ${message}`.toLowerCase();

  // The form asks for a description of a security need, not a link dump.
  const urls = message.match(/https?:\/\/|www\./gi) ?? [];
  if (urls.length >= 1) hit(1, `links:${urls.length}`);
  if (urls.length >= 3) hit(1, "links:several");
  if (urls.length >= 6) hit(1, "links:many");

  // Near-conclusive on their own: nothing renders markup in this form.
  if (/\[url[=\]]|\[\/url\]|\[link[=\]]|\[img[=\]]/i.test(message)) hit(2, "bbcode");
  if (/<a\s|<script|<iframe/i.test(message)) hit(2, "markup");

  // There is no URL field, so a URL in a name or company is a bot tell.
  // Deliberately not matching plain ".com" - real prospects do type their
  // company as "acme.com".
  if (/https?:\/\/|www\.|\.(ru|xyz|top|icu|click|shop|online)\b/i.test(`${name} ${company}`)) {
    hit(2, "link-in-name");
  }

  // Word-boundary matched so short tokens don't hit inside ordinary words.
  // Note: "crypto"/"bitcoin"/"ransom" are NOT listed - a security firm gets
  // legitimate inquiries containing all three.
  const phrases = [
    "seo", "backlink", "backlinks", "search engine ranking", "rank your site",
    "forex", "casino", "betting", "porn", "viagra", "cialis",
    "loan offer", "make money", "work from home", "guest post",
    "link building", "increase your traffic", "digital marketing agency",
    "web design services", "cheap price", "click here", "limited offer",
    "dear sir or madam", "unsubscribe", "sponsored post", "write for us",
  ];
  const hits = phrases.filter((p) =>
    new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack)
  );
  if (hits.length) hit(Math.min(hits.length, 3), `phrases:${hits.join("|")}`);

  // A run of non-Latin script in an English-language form: one signal, not
  // decisive on its own.
  if (/[\u0400-\u04FF]{6,}|[\u4E00-\u9FFF]{6,}/.test(message)) hit(1, "script");

  // Bots often reuse the same string for every field.
  if (name.trim().toLowerCase() === message.trim().toLowerCase()) hit(1, "duplicate-fields");

  // Disposable / throwaway sender domains.
  if (/@(mailinator|guerrillamail|10minutemail|yopmail|tempmail|trashmail|sharklasers)\./i.test(email)) {
    hit(1, "disposable-email");
  }

  return { score, reasons };
};

/**
 * Bots must not be able to tell a drop from a success, or they will retune
 * until they get through. Every rejection below the CORS layer returns the
 * same 200 body a genuine submission gets.
 */
const silentDrop = (why: string, cors: Record<string, string>) => {
  console.log(`[SPAM-DROP] ${why}`);
  return new Response(
    JSON.stringify({
      userEmail: { sent: true },
      companyEmail: { sent: true },
      message: "Your message was received and our team has been notified.",
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = corsFor(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Layer 1: origin allowlist. Direct-to-endpoint bots never get past this.
  if (!isAllowedOrigin(origin)) {
    console.log(`[SPAM-DROP] disallowed origin: ${origin ?? "(none)"}`);
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const clientIP = clientIpFrom(req);
    console.log("Client IP:", clientIP);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Layer 2: per-IP rate limit
    const hourAgo = new Date(Date.now() - BLOCK_DURATION_MS).toISOString();

    const { data: rateData, error: rateError } = await supabaseAdmin
      .from("newsletter_rate_limits")
      .select("attempts, last_attempt, blocked_until")
      .eq("ip_address", clientIP)
      .order("last_attempt", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rateError) {
      console.error("Rate limit check error:", rateError);
    }

    if (rateData?.blocked_until && new Date(rateData.blocked_until) > new Date()) {
      console.log("IP is blocked until:", rateData.blocked_until);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (
      rateData &&
      rateData.attempts >= MAX_ATTEMPTS_PER_HOUR &&
      new Date(rateData.last_attempt) > new Date(hourAgo)
    ) {
      await supabaseAdmin
        .from("newsletter_rate_limits")
        .update({ blocked_until: new Date(Date.now() + BLOCK_DURATION_MS).toISOString() })
        .eq("ip_address", clientIP);

      console.log("Rate limit exceeded, blocking IP");
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const requestText = await req.text();
    const formData: ContactFormData = JSON.parse(requestText);

    // Extract only allowed fields (ignore any recipient field from request)
    const {
      name,
      email,
      company,
      phone,
      message,
      leadSource,
      serviceInterest,
      expectedCloseDate,
      hpWebsite,
      elapsedMs,
    } = formData;

    // Layer 3: honeypot. Humans never see this field; bots fill it in.
    if (typeof hpWebsite === "string" && hpWebsite.trim() !== "") {
      return silentDrop(`honeypot filled from ${clientIP}`, corsHeaders);
    }

    // Layer 4: submission timing. Also catches any payload assembled without
    // loading the form, since elapsedMs is only produced by useFormShield.
    if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs)) {
      return silentDrop(`missing timing signal from ${clientIP}`, corsHeaders);
    }
    if (elapsedMs < MIN_FILL_MS) {
      return silentDrop(`submitted in ${elapsedMs}ms from ${clientIP}`, corsHeaders);
    }
    if (elapsedMs > MAX_FILL_MS) {
      return silentDrop(`stale payload (${elapsedMs}ms) from ${clientIP}`, corsHeaders);
    }

    // JSON gives no type guarantees: a non-string here would sail past the
    // length checks below and then throw inside sanitizeForHtml.
    const isStr = (v: unknown): v is string => typeof v === "string";
    if (
      !isStr(name) || !isStr(email) || !isStr(message) ||
      (company !== undefined && company !== null && !isStr(company)) ||
      (phone !== undefined && phone !== null && !isStr(phone))
    ) {
      console.log("Malformed field types");
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!name || !email || !message) {
      console.log("Missing required fields");
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000 ||
      (company && company.length > 200) ||
      (phone && phone.length > 50)
    ) {
      return new Response(JSON.stringify({ error: "Input exceeds maximum length" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Layer 5: content heuristics
    const { score, reasons } = spamScore(name, email, company ?? "", message);
    if (score >= SPAM_SCORE_THRESHOLD) {
      return silentDrop(
        `content score ${score} from ${clientIP} <${email}> [${reasons.join(", ")}]`,
        corsHeaders
      );
    }
    if (score > 0) {
      console.log(`[SPAM-WATCH] score ${score} from <${email}> [${reasons.join(", ")}]`);
    }

    // Update rate limit counter
    if (rateData) {
      const shouldResetCount = new Date(rateData.last_attempt) < new Date(hourAgo);
      await supabaseAdmin
        .from("newsletter_rate_limits")
        .update({
          attempts: shouldResetCount ? 1 : rateData.attempts + 1,
          last_attempt: new Date().toISOString(),
          email: email,
          blocked_until: null,
        })
        .eq("ip_address", clientIP);
    } else {
      await supabaseAdmin.from("newsletter_rate_limits").insert({
        ip_address: clientIP,
        email: email,
        attempts: 1,
        last_attempt: new Date().toISOString(),
      });
    }

    // Sanitize inputs for HTML email (prevent XSS in emails)
    const sanitizeForHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const safeName = sanitizeForHtml(name);
    const safeEmail = sanitizeForHtml(email);
    const safeCompany = company ? sanitizeForHtml(company) : null;
    const safeMessage = sanitizeForHtml(message);
    const safePhone = phone ? sanitizeForHtml(phone) : null;

    if (leadSource) {
      const { error: leadError } = await supabaseAdmin.from("leads").insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        source: leadSource,
        service_interest: serviceInterest || "General Inquiry",
        initial_message: message,
        expected_close_date: expectedCloseDate || null,
        status: "new",
        priority: "medium",
      });

      if (leadError) {
        console.error("Error creating lead from contact submission:", leadError);
      }
    }

    // Confirmation to the submitter. Deliberately does NOT echo the submitted
    // message: echoing it turns this endpoint into a relay that can deliver an
    // attacker's payload to an arbitrary address under our sending domain.
    console.log("Sending confirmation email to user");
    let userEmailSent = false;

    try {
      await resend.emails.send({
        from: "Cesium Cyber <no-reply@cesiumcyber.com>",
        to: [email],
        subject: "We've received your message - Cesium Cyber",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00c896;">Thank you for contacting Cesium Cyber</h2>
            <p>Hello ${safeName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>If you did not submit this form, you can safely ignore this email.</p>
            <p>Best regards,<br>The Cesium Cyber Team</p>
          </div>
        `,
      });
      console.log("User email sent successfully");
      userEmailSent = true;
    } catch (userEmailError) {
      console.error("Error sending user confirmation email:", userEmailError);
    }

    // Notification to the company with HARDCODED recipient
    console.log("Sending notification email to company at:", COMPANY_EMAIL);
    let companyEmailSent = false;

    try {
      await resend.emails.send({
        from: "Contact Form <no-reply@cesiumcyber.com>",
        to: [COMPANY_EMAIL], // Always use hardcoded recipient
        reply_to: email,
        subject: "New Contact Form Submission",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00c896;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ""}
            ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
            <p><strong>Message:</strong><br>${safeMessage}</p>
            <hr/>
            <p style="color: #666; font-size: 12px;">
              Submitted from IP: ${sanitizeForHtml(clientIP)}${score > 0 ? ` &middot; spam score ${score} (${reasons.join(", ")})` : ""}
            </p>
          </div>
        `,
      });
      console.log("Company email sent successfully");
      companyEmailSent = true;
    } catch (companyEmailError) {
      console.error("Error sending company notification email:", companyEmailError);
    }

    const responseData = {
      userEmail: { sent: userEmailSent },
      companyEmail: { sent: companyEmailSent },
      message:
        userEmailSent && companyEmailSent
          ? "Your message was received and our team has been notified."
          : userEmailSent
          ? "Your message was received but there was an issue notifying our team."
          : "Failed to send emails",
    };

    const statusCode = userEmailSent ? (companyEmailSent ? 200 : 207) : 500;

    return new Response(JSON.stringify(responseData), {
      status: statusCode,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
