
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import DashboardSecurity from "@/components/dashboard/DashboardSecurity";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProjectFiles from "@/components/dashboard/ProjectFiles";

const ClientDashboard = () => {
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const auth = localStorage.getItem("clientAuth");
    if (!auth || !JSON.parse(auth).isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientAuth");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Get username from localStorage
  const getUsername = () => {
    const auth = localStorage.getItem("clientAuth");
    return auth ? JSON.parse(auth).username : "";
  };

  return (
    <div className="bg-cyber min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Client Dashboard</h1>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-cesium text-cesium hover:bg-cyber-light"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
          
          <div className="mb-8">
            <div className="bg-cyber-light rounded-md p-4 border border-cesium/10">
              <h2 className="text-xl text-white mb-2">Welcome, {getUsername()}</h2>
              <p className="text-gray-300">
                This is your secure client dashboard. Here you can access your project information
                and communicate with our team.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DashboardSecurity />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectFiles />
            
            <div className="bg-cyber-light rounded-md p-4 border border-cesium/10">
              <h3 className="text-lg text-cesium mb-3">Next Meeting</h3>
              <p className="text-gray-300">Scheduled for April 20, 2025</p>
              <p className="text-gray-300">10:00 AM PST</p>
              <Button 
                className="mt-4 bg-cesium hover:bg-cesium/80 text-cyber-dark"
                size="sm"
              >
                Join Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
