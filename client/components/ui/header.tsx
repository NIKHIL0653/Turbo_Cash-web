import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./button";
import { Menu, X, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, userData, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a public page
  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`shadow-sm border-b ${isPublicPage ? "bg-white border-gray-200" : "bg-background border-border"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F04d13addb2044aadacba8e1009bd55e0%2F9b1fbf9496d4481fa9cbf801318433b5?format=webp&width=800"
              alt="TurboCash Logo"
              className="w-16 h-16"
            />
            <span
              className={`text-2xl font-bold ${isPublicPage ? "text-navy-900" : "text-foreground"}`}
            >
              TurboCash
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {userData.user?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {userData.user?.firstName}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isProfileOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      ></div>
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-xl border border-border py-1 z-50">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-popover-foreground">
                            {userData.user?.firstName} {userData.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userData.user?.email}
                          </p>
                        </div>

                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Desktop CTA Buttons for unauthenticated users */
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className={
                    isPublicPage
                      ? "text-navy-700 hover:text-teal-600"
                      : "text-foreground hover:text-teal-600"
                  }
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${isPublicPage ? "text-navy-700 hover:text-teal-600 hover:bg-gray-100" : "text-foreground hover:text-teal-600 hover:bg-muted"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t ${isPublicPage ? "border-gray-200 dark:border-gray-700" : "border-border"}`}
          >
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {userData.user?.firstName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {userData.user?.firstName} {userData.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userData.user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/settings"
                      className="text-foreground hover:text-teal-600 font-medium transition-colors flex items-center gap-2 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className="text-foreground hover:text-teal-600 justify-start w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`justify-start w-full ${isPublicPage ? "text-navy-700 hover:text-teal-600" : "text-foreground hover:text-teal-600"}`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white justify-start w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
