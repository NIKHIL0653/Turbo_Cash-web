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
import { Eye, EyeOff, Check, X } from "lucide-react";
import { validatePassword, getPasswordStrength } from "../lib/utils";

// Password Requirements Component
function PasswordRequirements({ password }: { password: string }) {
  const validation = validatePassword(password);

  const requirements = [
    { key: 'minLength', label: 'At least 8 characters', met: validation.requirements.minLength },
    { key: 'hasUppercase', label: 'One uppercase letter', met: validation.requirements.hasUppercase },
    { key: 'hasLowercase', label: 'One lowercase letter', met: validation.requirements.hasLowercase },
    { key: 'hasNumber', label: 'One number', met: validation.requirements.hasNumber },
    { key: 'hasSpecialChar', label: 'One special character', met: validation.requirements.hasSpecialChar },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-navy-700">Password Requirements:</p>
      <div className="grid grid-cols-1 gap-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2">
            {req.met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs ${req.met ? 'text-green-600' : 'text-red-600'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Password Strength Indicator Component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password);

  const getBarColor = (index: number) => {
    if (index <= strength.score) {
      switch (strength.color) {
        case 'red': return 'bg-red-500';
        case 'orange': return 'bg-orange-500';
        case 'yellow': return 'bg-yellow-500';
        case 'green': return 'bg-green-500';
        default: return 'bg-gray-300';
      }
    }
    return 'bg-gray-200';
  };

  return (
    <div className="mt-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-navy-700">Strength:</span>
        <span className={`text-xs font-medium ${
          strength.color === 'green' ? 'text-green-600' :
          strength.color === 'yellow' ? 'text-yellow-600' :
          strength.color === 'orange' ? 'text-orange-600' :
          'text-red-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${getBarColor(index)}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

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
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

            const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors[0]);
        setIsLoading(false);
        return;
      }

      // Get existing users from localStorage
      const storedUsers = JSON.parse(
        localStorage.getItem("turbocash_users") || "[]",
      );

      // Check if email already exists
      const existingUser = storedUsers.find(
        (user: any) => user.email === formData.email,
      );

      if (existingUser) {
        setError("An account with this email already exists");
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      };

      // Add user to stored users
      storedUsers.push(newUser);
      localStorage.setItem("turbocash_users", JSON.stringify(storedUsers));

      // Call UserContext login function which handles authentication state and data setup
      login(newUser);

      // Redirect to dashboard
      navigate("/dashboard");
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
    <div className="h-screen bg-gradient-to-br from-navy-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 overflow-y-auto" data-auth-page>
      <div className="w-full max-w-sm my-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F04d13addb2044aadacba8e1009bd55e0%2F9b1fbf9496d4481fa9cbf801318433b5?format=webp&width=800"
              alt="TurboCash Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-navy-900 dark:text-white">TurboCash</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-bold text-navy-900 dark:text-white">
              Create Account
            </CardTitle>
            <p className="text-xs text-navy-600 dark:text-gray-300">
              Join thousands managing their finances
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-2">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-xs">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="h-8 text-sm"
                />
              </div>

                            <div className="space-y-1">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange(e);
                      setPasswordTouched(true);
                    }}
                    placeholder="Create a strong password"
                    required
                    className="h-8 text-sm pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Requirements - Simplified */}
                {passwordTouched && formData.password && (
                  <div className="mt-1">
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="h-8 text-sm pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 bg-teal-500 hover:bg-teal-600 text-white text-sm"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-sm text-navy-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-2 text-center">
          <Link to="/" className="text-navy-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
