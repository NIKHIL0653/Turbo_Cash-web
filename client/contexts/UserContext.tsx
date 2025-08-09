import React, { createContext, useContext, useState, useEffect } from "react";
import { databaseService } from "../services/database";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  currency?: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  userId: string;
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  userId: string;
}

interface Goal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  userId: string;
}

interface Subscription {
  id: string;
  name: string;
  platform: string;
  amount: number;
  billableMonths: number;
  purchaseDate: string;
  nextRenewal: string;
  isActive: boolean;
  userId: string;
}

interface UserData {
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
  categories: string[];
}

interface UserContextType {
  userData: UserData;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  updateUserProfile: (profile: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "userId">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id" | "userId" | "spent">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addGoal: (
    goal: Omit<Goal, "id" | "userId" | "currentAmount" | "createdAt">,
  ) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (goalId: string, amount: number) => void;
  addSubscription: (subscription: Omit<Subscription, "id" | "userId">) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>({
    user: null,
    transactions: [],
    budgets: [],
    goals: [],
    subscriptions: [],
    categories: [
      "Food & Dining",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills & Utilities",
      "Healthcare",
      "Education",
      "Travel",
      "Other",
    ],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("turbocash_current_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      login(user);
    }
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    if (userData.user) {
      localStorage.setItem(
        `turbocash_data_${userData.user.id}`,
        JSON.stringify(userData),
      );
    }
  }, [userData]);

  const login = (user: User) => {
    // Load user data from localStorage
    const storedData = localStorage.getItem(`turbocash_data_${user.id}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      // Ensure subscriptions array exists for existing users
      // Also migrate budgets to include startDate if missing
      const migratedBudgets = (data.budgets || []).map((budget: any) => ({
        ...budget,
        startDate: budget.startDate || new Date().toISOString(),
      }));

      setUserData({
        ...data,
        subscriptions: data.subscriptions || [],
        budgets: migratedBudgets,
      });
    } else {
      // Create completely empty initial data structure for new user
      const userWithDefaultCurrency = {
        ...user,
        currency: user.currency || "INR",
      };
      const emptyUserData = {
        user: userWithDefaultCurrency,
        transactions: [],
        budgets: [],
        goals: [],
        subscriptions: [],
        categories: [
          "Food & Dining",
          "Transportation",
          "Shopping",
          "Entertainment",
          "Bills & Utilities",
          "Healthcare",
          "Education",
          "Travel",
          "Other",
        ],
      };
      setUserData(emptyUserData);
      // Save empty data structure
      localStorage.setItem(
        `turbocash_data_${user.id}`,
        JSON.stringify(emptyUserData),
      );
    }
    setIsAuthenticated(true);
    localStorage.setItem("turbocash_current_user", JSON.stringify(user));
  };

  const logout = () => {
    setUserData({
      user: null,
      transactions: [],
      budgets: [],
      goals: [],
      subscriptions: [],
      categories: [],
    });
    setIsAuthenticated(false);
    localStorage.removeItem("turbocash_current_user");
    // Reset theme to light mode when logging out
    localStorage.setItem("turbocash_theme", "light");
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "userId">) => {
    if (!userData.user) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: userData.user.id,
    };

    setUserData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));

    // Update budget spending if it's an expense
    if (transaction.type === "expense") {
      const budget = userData.budgets.find(
        (b) => b.category.toLowerCase() === transaction.category.toLowerCase(),
      );
      if (budget) {
        updateBudget(budget.id, { spent: budget.spent + transaction.amount });
      }
    }
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t,
      ),
    }));
  };

  const deleteTransaction = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const calculatePastSpending = (
    category: string,
    period: "weekly" | "monthly" | "yearly",
    startDate: string,
  ): number => {
    const start = new Date(startDate);
    const today = new Date();

    // Filter transactions for this category and time period
    const relevantTransactions = userData.transactions.filter((transaction) => {
      if (transaction.type !== "expense") return false;
      if (transaction.category.toLowerCase() !== category.toLowerCase())
        return false;

      const transactionDate = new Date(transaction.date);

      // Check if transaction falls within the budget period
      switch (period) {
        case "weekly":
          // Calculate the start of the current week
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          weekStart.setHours(0, 0, 0, 0);
          return transactionDate >= weekStart && transactionDate <= today;

        case "monthly":
          // Calculate the start of the current month
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return transactionDate >= monthStart && transactionDate <= today;

        case "yearly":
          // Calculate the start of the current year
          const yearStart = new Date(today.getFullYear(), 0, 1);
          return transactionDate >= yearStart && transactionDate <= today;

        default:
          return false;
      }
    });

    return relevantTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  };

  const addBudget = (
    budget: Omit<Budget, "id" | "userId" | "spent" | "startDate">,
  ) => {
    if (!userData.user) return;

    const startDate = new Date().toISOString();
    const pastSpending = calculatePastSpending(
      budget.category,
      budget.period,
      startDate,
    );

    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      userId: userData.user.id,
      spent: pastSpending,
      startDate,
    };

    setUserData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newBudget],
    }));
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setUserData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
    }));
  };

  const deleteBudget = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
  };

  const addGoal = (
    goal: Omit<Goal, "id" | "userId" | "currentAmount" | "createdAt">,
  ) => {
    if (!userData.user) return;

    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      userId: userData.user.id,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };

    setUserData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
    }));
  };

  const deleteGoal = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const addGoalContribution = (goalId: string, amount: number) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g,
      ),
    }));
  };

  const addSubscription = (
    subscription: Omit<Subscription, "id" | "userId">,
  ) => {
    if (!userData.user) return;

    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      userId: userData.user.id,
    };

    setUserData((prev) => ({
      ...prev,
      subscriptions: [...(prev.subscriptions || []), newSubscription],
    }));
  };

  const updateSubscription = (
    id: string,
    subscription: Partial<Subscription>,
  ) => {
    setUserData((prev) => ({
      ...prev,
      subscriptions: (prev.subscriptions || []).map((s) =>
        s.id === id ? { ...s, ...subscription } : s,
      ),
    }));
  };

  const deleteSubscription = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      subscriptions: (prev.subscriptions || []).filter((s) => s.id !== id),
    }));
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!userData.user) return;

    const updatedUser = { ...userData.user, ...profile };

    // Update current session
    setUserData((prev) => ({
      ...prev,
      user: updatedUser,
    }));

    // Update stored user in users list
    const users = JSON.parse(localStorage.getItem("turbocash_users") || "[]");
    const updatedUsers = users.map((u: User) =>
      u.id === userData.user?.id ? updatedUser : u,
    );
    localStorage.setItem("turbocash_users", JSON.stringify(updatedUsers));
    localStorage.setItem("turbocash_current_user", JSON.stringify(updatedUser));
  };

  const value: UserContextType = {
    userData,
    isAuthenticated,
    login,
    logout,
    updateUserData,
    updateUserProfile,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalContribution,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
