
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, FileText, Shield } from "lucide-react";

type ActivityItem = {
  icon: "file" | "calendar" | "security" | "activity";
  content: string;
  timestamp: string;
  highlight?: boolean;
};

const ActivityFeed = () => {
  const activities: ActivityItem[] = [
    {
      icon: "security",
      content: "Security audit completed",
      timestamp: "Today, 9:41 AM",
      highlight: true,
    },
    {
      icon: "file",
      content: "New vulnerability report available",
      timestamp: "Yesterday, 3:23 PM",
    },
    {
      icon: "calendar",
      content: "Scheduled maintenance window",
      timestamp: "Apr 18, 2025, 11:00 PM",
    },
    {
      icon: "activity",
      content: "System performance check completed",
      timestamp: "Apr 17, 2025, 2:12 PM",
    },
    {
      icon: "security",
      content: "Firewall rules updated",
      timestamp: "Apr 16, 2025, 10:30 AM",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "file":
        return <FileText className="h-4 w-4" />;
      case "calendar":
        return <Calendar className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "activity":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-cyber-dark border-cesium/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex space-x-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.highlight ? 'bg-cesium/20 text-cesium' : 'bg-cyber-light/20 text-gray-400'}`}>
                {getIcon(activity.icon)}
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-200">{activity.content}</p>
                <p className="text-xs text-gray-400">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
