import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay before transitioning
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment for realistic loading
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F04d13addb2044aadacba8e1009bd55e0%2F9b1fbf9496d4481fa9cbf801318433b5?format=webp&width=800"
            alt="TurboCash Logo"
            className="w-24 h-24 animate-pulse"
          />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">
          TurboCash
        </h1>

        {/* Mac-style Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Loading your financial dashboard...
        </p>
      </div>
    </div>
  );
}
