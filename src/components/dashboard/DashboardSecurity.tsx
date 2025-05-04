
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Check } from "lucide-react";

type SecurityItemProps = {
  title: string;
  status: "secure" | "warning" | "critical";
  description: string;
};

const SecurityItem = ({ title, status, description }: SecurityItemProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "secure":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "secure":
        return "bg-green-500/10 text-green-500";
      case "warning":
        return "bg-amber-500/10 text-amber-500";
      case "critical":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-start space-x-4 p-3 rounded-md border border-cesium/10 bg-cyber-light/20">
      <div className={`p-2 rounded-full ${getStatusClass()}`}>
        {getStatusIcon()}
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const DashboardSecurity = () => {
  const [securityItems, setSecurityItems] = useState<SecurityItemProps[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const securityData = [
      {
        title: "Firewall Status",
        status: "secure",
        description: "Your network firewall is properly configured and active."
      },
      {
        title: "Endpoint Protection",
        status: "warning",
        description: "3 devices need security updates."
      },
      {
        title: "Data Encryption",
        status: "secure",
        description: "All sensitive data is properly encrypted."
      },
      {
        title: "Access Controls",
        status: "secure",
        description: "Role-based access controls are implemented."
      }
    ];
    
    setSecurityItems(securityData);
  }, []);

  return (
    <Card className="bg-cyber-dark border-cesium/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-white text-lg">
          <Shield className="mr-2 h-5 w-5 text-cesium" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityItems.map((item, index) => (
            <SecurityItem key={index} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSecurity;
