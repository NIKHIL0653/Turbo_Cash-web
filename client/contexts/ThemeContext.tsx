import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkModeAllowed: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper function to check if a route allows dark mode (only authenticated routes)
const isDarkModeAllowedForRoute = (pathname: string, isAuthenticated: boolean) => {
  const publicRoutes = ["/", "/login", "/register", "/about", "/contact", "/privacy", "/terms", "/notice"];
  const demoRoutes = ["/demo/dashboard", "/demo/analytics", "/demo/budget", "/demo/goals", "/demo/recurring"];

  // Demo routes and authenticated routes allow dark mode
  const isDemoRoute = demoRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  return isDemoRoute || (isAuthenticated && !isPublicRoute);
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  isAuthenticated?: boolean;
  currentPath?: string;
}> = ({ children, isAuthenticated = false, currentPath = "/" }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  const isDarkModeAllowed = isDarkModeAllowedForRoute(currentPath, isAuthenticated);

  // Initialize theme from localStorage only if dark mode is allowed
  useEffect(() => {
    if (isDarkModeAllowed) {
      const storedTheme = localStorage.getItem("turbocash_theme") as Theme;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    } else {
      // Force light mode for public pages
      setThemeState("light");
    }
  }, [isDarkModeAllowed]);

  // Reset to light mode when user logs out or navigates to public pages
  useEffect(() => {
    if (!isDarkModeAllowed && theme === "dark") {
      setThemeState("light");
    }
  }, [isDarkModeAllowed, theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark" && isDarkModeAllowed) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, isDarkModeAllowed]);

  const setTheme = (newTheme: Theme) => {
    // Only allow dark theme if it's permitted for current route/auth state
    if (newTheme === "dark" && !isDarkModeAllowed) {
      return;
    }

    setThemeState(newTheme);
    localStorage.setItem("turbocash_theme", newTheme);
  };

  const toggleTheme = () => {
    // Only allow toggling to dark if it's permitted
    if (theme === "light" && !isDarkModeAllowed) {
      return;
    }

    setTheme(theme === "light" ? "dark" : "light");
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDarkModeAllowed,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
