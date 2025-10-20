import { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import ScrollToTop from "@/components/utils/ScrollToTop";

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "mfa",
    category: "Authentication",
    question: "Is Multi-Factor Authentication (MFA) enforced for all users?",
    options: [
      { value: "all", label: "Yes, for all users", score: 10 },
      { value: "admins", label: "Only for administrators", score: 5 },
      { value: "none", label: "Not enforced", score: 0 }
    ]
  },
  {
    id: "conditional-access",
    category: "Access Control",
    question: "Do you have Conditional Access policies configured?",
    options: [
      { value: "comprehensive", label: "Yes, comprehensive policies", score: 10 },
      { value: "basic", label: "Basic policies only", score: 5 },
      { value: "none", label: "No policies configured", score: 0 }
    ]
  },
  {
    id: "dlp",
    category: "Data Protection",
    question: "Are Data Loss Prevention (DLP) policies in place?",
    options: [
      { value: "active", label: "Yes, actively enforced", score: 10 },
      { value: "monitoring", label: "Monitor mode only", score: 5 },
      { value: "none", label: "Not configured", score: 0 }
    ]
  },
  {
    id: "email-security",
    category: "Email Security",
    question: "Do you use Advanced Threat Protection for email?",
    options: [
      { value: "atp", label: "Yes, with ATP policies", score: 10 },
      { value: "basic", label: "Basic EOP only", score: 5 },
      { value: "none", label: "No additional protection", score: 0 }
    ]
  },
  {
    id: "teams-security",
    category: "Teams Security",
    question: "Are Microsoft Teams external access controls configured?",
    options: [
      { value: "restricted", label: "Restricted with policies", score: 10 },
      { value: "default", label: "Default settings", score: 5 },
      { value: "open", label: "Open to all", score: 0 }
    ]
  },
  {
    id: "sharepoint-sharing",
    category: "SharePoint/OneDrive",
    question: "How are external sharing settings configured in SharePoint/OneDrive?",
    options: [
      { value: "restricted", label: "Restricted with expiration", score: 10 },
      { value: "authenticated", label: "Authenticated users only", score: 7 },
      { value: "anyone", label: "Anyone with link", score: 0 }
    ]
  },
  {
    id: "audit-logs",
    category: "Monitoring",
    question: "Are audit logs enabled and regularly reviewed?",
    options: [
      { value: "active", label: "Yes, actively monitored", score: 10 },
      { value: "enabled", label: "Enabled but not reviewed", score: 5 },
      { value: "none", label: "Not enabled", score: 0 }
    ]
  },
  {
    id: "privileged-access",
    category: "Access Management",
    question: "Is Privileged Identity Management (PIM) configured?",
    options: [
      { value: "implemented", label: "Yes, fully implemented", score: 10 },
      { value: "partial", label: "Partially configured", score: 5 },
      { value: "none", label: "Not configured", score: 0 }
    ]
  },
  {
    id: "security-alerts",
    category: "Monitoring",
    question: "Are security alerts and notifications configured?",
    options: [
      { value: "comprehensive", label: "Comprehensive alerting", score: 10 },
      { value: "basic", label: "Basic alerts only", score: 5 },
      { value: "none", label: "No alerts configured", score: 0 }
    ]
  },
  {
    id: "device-compliance",
    category: "Device Management",
    question: "Are device compliance policies enforced?",
    options: [
      { value: "enforced", label: "Yes, fully enforced", score: 10 },
      { value: "reporting", label: "Reporting only", score: 5 },
      { value: "none", label: "Not configured", score: 0 }
    ]
  }
];

const M365SecurityAssessment = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find(opt => opt.value === answer);
        if (option) totalScore += option.score;
      }
    });
    return totalScore;
  };

  const getScoreCategory = (score: number) => {
    const percentage = (score / 100) * 100;
    if (percentage >= 80) return { level: "Excellent", color: "text-green-400", icon: CheckCircle };
    if (percentage >= 60) return { level: "Good", color: "text-blue-400", icon: Shield };
    if (percentage >= 40) return { level: "Fair", color: "text-yellow-400", icon: AlertTriangle };
    return { level: "Needs Improvement", color: "text-red-400", icon: XCircle };
  };

  const getRecommendations = () => {
    const recs: string[] = [];
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find(opt => opt.value === answer);
        if (option && option.score < 10) {
          recs.push(`${q.category}: ${q.question.replace("?", "")} - Consider implementing stronger controls.`);
        }
      }
    });
    return recs;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length) {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const score = calculateScore();
  const scoreCategory = getScoreCategory(score);
  const recommendations = getRecommendations();
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <>
      <Helmet>
        <title>Microsoft 365 Security Assessment | CesiumCyber</title>
        <meta 
          name="description" 
          content="Free Microsoft 365 security posture assessment. Evaluate your M365 environment security with our comprehensive self-assessment tool." 
        />
      </Helmet>

      <div className="min-h-screen bg-cyber">
        <Navbar />
        
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Microsoft 365 <span className="text-cesium">Security Assessment</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Evaluate your Microsoft 365 security posture with our comprehensive self-assessment tool. Answer questions about your current configuration and receive a security score with actionable recommendations.
              </p>
            </div>

            {!showResults ? (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      Progress: {Object.keys(answers).length} of {questions.length} questions
                    </span>
                    <span className="text-sm text-cesium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-6">
                  {questions.map((q) => (
                    <Card key={q.id} className="bg-cyber-dark border-cesium/20 p-6">
                      <div className="mb-4">
                        <span className="text-sm text-cesium font-semibold">{q.category}</span>
                        <h3 className="text-lg font-semibold text-white mt-2">{q.question}</h3>
                      </div>
                      
                      <RadioGroup
                        value={answers[q.id]}
                        onValueChange={(value) => handleAnswer(q.id, value)}
                      >
                        <div className="space-y-3">
                          {q.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-3">
                              <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                              <Label 
                                htmlFor={`${q.id}-${option.value}`}
                                className="text-gray-300 cursor-pointer flex-1"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="bg-cesium hover:bg-cesium/90 text-cyber font-semibold px-8 py-6 text-lg"
                  >
                    View Results
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <Card className="bg-cyber-dark border-cesium/20 p-8 text-center">
                  <div className="mb-6">
                    <scoreCategory.icon className={`w-20 h-20 mx-auto ${scoreCategory.color} mb-4`} />
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Security Score: <span className={scoreCategory.color}>{score}/100</span>
                    </h2>
                    <p className={`text-xl ${scoreCategory.color} font-semibold`}>
                      {scoreCategory.level}
                    </p>
                  </div>
                  
                  <div className="w-full bg-cyber rounded-full h-4 mb-4">
                    <div 
                      className="bg-cesium h-4 rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </Card>

                {recommendations.length > 0 && (
                  <Card className="bg-cyber-dark border-cesium/20 p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-cesium" />
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-3">
                          <span className="text-cesium mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Card className="bg-cyber-dark border-cesium/20 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Next Steps</h3>
                  <p className="text-gray-300 mb-6">
                    Our cybersecurity experts can help you implement these security improvements and strengthen your Microsoft 365 environment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={resetAssessment}
                      variant="outline"
                      className="border-cesium text-cesium hover:bg-cesium hover:text-cyber"
                    >
                      Retake Assessment
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/contact'}
                      className="bg-cesium hover:bg-cesium/90 text-cyber font-semibold"
                    >
                      Schedule Consultation
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default M365SecurityAssessment;
