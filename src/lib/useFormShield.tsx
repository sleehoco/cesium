import { forwardRef, useRef } from "react";

/**
 * Invisible anti-bot layer shared by every public form that posts to the
 * send-contact-email function. Two signals, both free of user friction:
 *
 *  - honeypot: a field named "website" that is off-screen for humans but
 *    looks like an ordinary input to a form-filling bot.
 *  - elapsed time: humans take seconds to fill a form; bots post instantly.
 *
 * Elapsed time is measured client-side and sent as a duration (not a
 * timestamp) so client clock skew can't cause false rejections.
 *
 * These only cover submissions that come through the page. Bots that POST
 * straight at the edge function are handled server-side in
 * supabase/functions/send-contact-email.
 */
export type ShieldPayload = {
  hpWebsite: string;
  elapsedMs: number;
};

/** Module-level so it keeps its identity (and its value) across re-renders. */
export const HoneypotField = forwardRef<HTMLInputElement>((_props, ref) => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      left: "-9999px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
    }}
  >
    <label htmlFor="website">Website (leave blank)</label>
    <input
      ref={ref}
      type="text"
      id="website"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      defaultValue=""
    />
  </div>
));
HoneypotField.displayName = "HoneypotField";

export const useFormShield = () => {
  const mountedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const getShieldPayload = (): ShieldPayload => ({
    hpWebsite: honeypotRef.current?.value ?? "",
    elapsedMs: Date.now() - mountedAt.current,
  });

  return { honeypotRef, getShieldPayload };
};
