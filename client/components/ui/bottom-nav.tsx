import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
} from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/analytics",
      icon: BarChart3,
      label: "Analytics",
    },
    {
      to: "/budget",
      icon: DollarSign,
      label: "Budget",
    },
    {
      to: "/goals",
      icon: Target,
      label: "Goals",
    },
    {
      to: "/recurring",
      icon: Calendar,
      label: "Recurring",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 text-xs transition-colors ${
                  isActive
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
