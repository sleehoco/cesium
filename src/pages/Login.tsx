
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real application, you'd want to hash these values or use a more secure approach
    // This is a simple client-side only implementation
    const correctUsername = "client";
    const correctPassword = "securepassword";

    setTimeout(() => {
      if (username === correctUsername && password === correctPassword) {
        // Store authentication in localStorage
        localStorage.setItem("clientAuth", JSON.stringify({
          isAuthenticated: true,
          username
        }));
        toast.success("Login successful");
        navigate("/client-dashboard");
      } else {
        toast.error("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000); // Simulate network request
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber p-4">
      <div className="w-full max-w-md">
        <Card className="border-cesium/20 bg-cyber-dark">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-muted p-3">
                <Lock className="h-6 w-6 text-cesium" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Client Login</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-cyber-light text-white border-cesium/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-cyber-light text-white border-cesium/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-400">
            <p className="w-full">
              This is a secure client area. Unauthorized access is prohibited.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
