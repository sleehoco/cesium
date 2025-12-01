import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Clock, Send, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LeadFollowupSettings = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [testing, setTesting] = useState(false);
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCronJobs();
    }
  }, [user, isAdmin]);

  const fetchCronJobs = async () => {
    try {
      const { data, error } = await supabase.rpc('get_cron_jobs' as any);
      if (!error && data) {
        setCronJobs(data);
      }
    } catch (error) {
      console.log("Could not fetch cron jobs (this is normal if pg_cron extension is not enabled)");
    } finally {
      setLoadingJobs(false);
    }
  };

  const testFollowupFunction = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("automated-lead-followup", {
        body: { test: true }
      });

      if (error) throw error;

      toast.success("Test completed!", {
        description: `Processed ${data.processed} leads. Check the edge function logs for details.`
      });
    } catch (error) {
      console.error("Error testing follow-up:", error);
      toast.error("Test failed", {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  if (isLoading || loadingJobs) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const emailTemplates = [
    {
      status: "new",
      subject: "Thank you for your inquiry",
      description: "Sent immediately after a new lead is created",
      timing: "Within 24 hours"
    },
    {
      status: "contacted",
      subject: "Following up on your needs",
      description: "Follow-up after initial contact",
      timing: "2 days after last contact"
    },
    {
      status: "qualified",
      subject: "Your custom security proposal",
      description: "Sent when preparing proposal",
      timing: "2 days after qualification"
    },
    {
      status: "proposal_sent",
      subject: "Checking in on your proposal",
      description: "Follow-up on sent proposals",
      timing: "2 days after proposal sent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Automated Follow-up Settings</h1>
          <p className="text-muted-foreground">Manage automated email follow-ups for your sales pipeline</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </CardTitle>
              <CardDescription>Automated follow-ups run daily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9:00 AM</div>
              <p className="text-sm text-muted-foreground mt-1">Every day</p>
              <Badge className="mt-3" variant="secondary">Active</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>Status-based templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emailTemplates.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Active templates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Testing
              </CardTitle>
              <CardDescription>Test the follow-up system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testFollowupFunction}
                disabled={testing}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {testing ? "Testing..." : "Run Test"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Templates by Status</CardTitle>
            <CardDescription>
              Automated emails are sent based on lead status and time since last contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailTemplates.map((template) => (
                <div 
                  key={template.status}
                  className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold capitalize">
                        {template.status.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Badge variant="outline">{template.timing}</Badge>
                  </div>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Subject: {template.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                <p>The system runs automatically every day at 9:00 AM</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                <p>It finds leads that haven't been contacted in the last 48 hours</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                <p>Sends personalized emails based on the lead's current status</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                <p>Updates the lead's contact history and logs the activity</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                <p>Prevents duplicate emails by tracking last contact timestamp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> Make sure your Resend domain is verified at{" "}
            <a 
              href="https://resend.com/domains" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              resend.com/domains
            </a>
            {" "}for emails to be delivered successfully.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeadFollowupSettings;