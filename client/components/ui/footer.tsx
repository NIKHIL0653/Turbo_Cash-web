import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

// Full footer for landing page and non-authenticated users
export function Footer() {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

    return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F04d13addb2044aadacba8e1009bd55e0%2F9b1fbf9496d4481fa9cbf801318433b5?format=webp&width=800"
                alt="TurboCash Logo"
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold">TurboCash</span>
            </div>
                                    <p className="text-gray-300 max-w-md">
              Take control of your finances with smart insights, budgeting
              tools, and goal tracking. TurboCharge your financial future today.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Analytics
              </Link>
              <Link
                to="/budget"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Budgeting
              </Link>
              <Link
                to="/goals"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Goal Tracking
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <div className="space-y-2">
              <Link
                to="/about"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-gray-300 hover:text-teal-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 TurboCash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Simple footer for authenticated users
export function SimpleFooter() {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <footer className={`py-4 ${isPublicPage ? 'bg-white border-t border-gray-200' : 'bg-background border-t border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-wrap items-center justify-center text-sm gap-4 ${isPublicPage ? 'text-navy-600' : 'text-muted-foreground'}`}>
          <span>© 2025 TurboCash. All rights reserved.</span>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
                        className={`transition-colors ${isPublicPage ? 'hover:text-navy-900' : 'hover:text-foreground'}`}
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
                        className={`transition-colors ${isPublicPage ? 'hover:text-navy-900' : 'hover:text-foreground'}`}
          >
            Privacy Policy
          </a>
          <a
            href="/notice"
            target="_blank"
            rel="noopener noreferrer"
                        className={`transition-colors ${isPublicPage ? 'hover:text-navy-900' : 'hover:text-foreground'}`}
          >
            Notice at Collection
          </a>
        </div>
      </div>
    </footer>
  );
}
