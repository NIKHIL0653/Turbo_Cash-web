import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Recurring from "./pages/Recurring";
import Settings from "./pages/Settings";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import { Header } from "./components/ui/header";
import { Footer, SimpleFooter } from "./components/ui/footer";
import { BottomNav } from "./components/ui/bottom-nav";
import { UserProvider } from "./contexts/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useUser } from "./contexts/UserContext";
import "./global.css";

// Placeholder page component for routes not yet implemented
function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        <p className="text-sm text-muted-foreground">
          This page is coming soon! Continue prompting to have this page built
          out with full functionality.
        </p>
      </div>
    </div>
  );
}

// Conditional footer component
function ConditionalFooter() {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const hideFooterPaths = ["/login", "/register"];

  if (hideFooterPaths.includes(location.pathname)) {
    return null;
  }

  return isAuthenticated ? <SimpleFooter /> : <Footer />;
}

// Conditional bottom navigation
function ConditionalBottomNav() {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const hideBottomNavPaths = ["/login", "/register"];

  if (hideBottomNavPaths.includes(location.pathname)) {
    return null;
  }

  return isAuthenticated ? <BottomNav /> : null;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pb-24 md:pb-6 [&:has([data-auth-page])]:pb-0">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <Budget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring"
                element={
                  <ProtectedRoute>
                    <Recurring />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PlaceholderPage
                    title="About Us"
                    description="Learn more about our mission and team."
                  />
                }
              />
              <Route
                path="/contact"
                element={
                  <PlaceholderPage
                    title="Contact"
                    description="Get in touch with our support team."
                  />
                }
              />
              <Route
                path="/privacy"
                element={
                  <PlaceholderPage
                    title="Privacy Policy"
                    description="Our commitment to protecting your data."
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PlaceholderPage
                    title="Terms of Service"
                    description="Terms and conditions for using TurboCash."
                  />
                }
              />
              <Route
                path="/notice"
                element={
                  <PlaceholderPage
                    title="Notice at Collection"
                    description="Information about data collection practices."
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ConditionalFooter />
          <ConditionalBottomNav />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}
