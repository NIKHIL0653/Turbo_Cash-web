import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { setupDemoData } from "../utils/demoData";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Setup demo data if it doesn't exist (only for demo account)
      if (formData.email === "demo@turbocash.com") {
        setupDemoData();
      }

      // Get stored users from localStorage
      const storedUsers = JSON.parse(
        localStorage.getItem("turbocash_users") || "[]",
      );

      // Find user with matching email and password
      const user = storedUsers.find(
        (u: any) =>
          u.email === formData.email && u.password === formData.password,
      );

      if (user) {
        // Call UserContext login function which handles authentication state
        login(user);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    return (
    <div className="h-screen bg-gradient-to-br from-navy-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" data-auth-page>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F04d13addb2044aadacba8e1009bd55e0%2F9b1fbf9496d4481fa9cbf801318433b5?format=webp&width=800"
              alt="TurboCash Logo"
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold text-navy-900 dark:text-white">TurboCash</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-navy-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-navy-600 dark:text-gray-300">Sign in to your account</p>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="h-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-3 text-center">
              <p className="text-sm text-navy-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                >
                  Get started
                </Link>
              </p>
            </div>

            {/* Demo Account */}
            <div className="mt-2 p-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
              <p className="text-xs text-teal-800 dark:text-teal-200 font-medium mb-1">
                Demo Account:
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-300">
                demo@turbocash.com • demo123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3 text-center">
          <Link to="/" className="text-navy-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
