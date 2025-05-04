
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProjectFile = {
  name: string;
  type: string;
  size: string;
  date: string;
};

const ProjectFiles = () => {
  const files: ProjectFile[] = [
    {
      name: "Security Audit Report",
      type: "PDF",
      size: "2.4 MB",
      date: "Apr 20, 2025",
    },
    {
      name: "Vulnerability Assessment",
      type: "DOCX",
      size: "1.8 MB",
      date: "Apr 19, 2025",
    },
    {
      name: "Network Diagram",
      type: "PNG",
      size: "3.2 MB",
      date: "Apr 18, 2025",
    },
    {
      name: "Implementation Plan",
      type: "PDF",
      size: "4.5 MB",
      date: "Apr 15, 2025",
    },
  ];

  return (
    <Card className="bg-cyber-dark border-cesium/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Project Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-md bg-cyber-light/10 border border-cesium/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-cyber-light/20">
                  <FileText className="h-4 w-4 text-cesium" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.type} • {file.size} • {file.date}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-cesium">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-cesium">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFiles;
