import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency utility functions
export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

export function getCurrencySymbol(currencyCode: string = "INR"): string {
  return currencies.find((c) => c.code === currencyCode)?.symbol || "₹";
}

export function formatCurrency(
  amount: number,
  currencyCode: string = "INR",
): string {
  const symbol = getCurrencySymbol(currencyCode);
  // Handle undefined, null, NaN values
  const safeAmount = isNaN(amount) || amount == null ? 0 : amount;
  return `${symbol}${safeAmount.toLocaleString()}`;
}

// Password validation utilities
export interface PasswordValidationResult {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const errors: string[] = [];

  if (!requirements.minLength) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!requirements.hasUppercase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!requirements.hasLowercase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!requirements.hasNumber) {
    errors.push("Password must contain at least one number");
  }
  if (!requirements.hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  const isValid = Object.values(requirements).every(Boolean);

  return {
    isValid,
    requirements,
    errors,
  };
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  const validation = validatePassword(password);
  const passedCount = Object.values(validation.requirements).filter(Boolean).length;

  if (passedCount === 0) {
    return { score: 0, label: "Very Weak", color: "red" };
  } else if (passedCount <= 2) {
    return { score: 1, label: "Weak", color: "red" };
  } else if (passedCount <= 3) {
    return { score: 2, label: "Fair", color: "orange" };
  } else if (passedCount <= 4) {
    return { score: 3, label: "Good", color: "yellow" };
  } else {
    return { score: 4, label: "Strong", color: "green" };
  }
}
