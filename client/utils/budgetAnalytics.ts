interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  userId: string;
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

export const calculateDaysToNextBudgetPeriod = (budget: Budget): number => {
  const startDate = new Date(budget.startDate);
  const today = new Date();
  let nextPeriodStart: Date;

  switch (budget.period) {
    case "weekly":
      nextPeriodStart = new Date(startDate);
      const weeksPassed = Math.floor(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      nextPeriodStart.setDate(startDate.getDate() + (weeksPassed + 1) * 7);
      break;
    case "monthly":
      nextPeriodStart = new Date(startDate);
      nextPeriodStart.setMonth(nextPeriodStart.getMonth() + 1);
      while (nextPeriodStart <= today) {
        nextPeriodStart.setMonth(nextPeriodStart.getMonth() + 1);
      }
      break;
    case "yearly":
      nextPeriodStart = new Date(startDate);
      nextPeriodStart.setFullYear(nextPeriodStart.getFullYear() + 1);
      while (nextPeriodStart <= today) {
        nextPeriodStart.setFullYear(nextPeriodStart.getFullYear() + 1);
      }
      break;
    default:
      return 0;
  }

  const diffTime = nextPeriodStart.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateBudgetRiskLevel = (
  budget: Budget,
  transactions: Transaction[],
): {
  riskLevel: "low" | "medium" | "high" | "critical";
  daysToRunOut: number | null;
  averageDailySpend: number;
  remainingDays: number;
} => {
  const startDate = new Date(budget.startDate);
  const today = new Date();
  const remaining = budget.allocated - budget.spent;

  // Calculate current period boundaries
  let currentPeriodStart = new Date(startDate);
  let currentPeriodEnd: Date;

  switch (budget.period) {
    case "weekly":
      const weeksPassed = Math.floor(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      currentPeriodStart.setDate(startDate.getDate() + weeksPassed * 7);
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setDate(currentPeriodStart.getDate() + 7);
      break;
    case "monthly":
      while (currentPeriodStart <= today) {
        const nextMonth = new Date(currentPeriodStart);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (nextMonth > today) break;
        currentPeriodStart = nextMonth;
      }
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setMonth(currentPeriodStart.getMonth() + 1);
      break;
    case "yearly":
      while (currentPeriodStart <= today) {
        const nextYear = new Date(currentPeriodStart);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        if (nextYear > today) break;
        currentPeriodStart = nextYear;
      }
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setFullYear(currentPeriodStart.getFullYear() + 1);
      break;
    default:
      currentPeriodEnd = new Date(today);
  }

  // Get transactions for current budget period
  const periodTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.category.toLowerCase() === budget.category.toLowerCase() &&
      t.type === "expense" &&
      transactionDate >= currentPeriodStart &&
      transactionDate <= today
    );
  });

  // Calculate daily spending rate
  const daysElapsed = Math.max(
    1,
    Math.floor(
      (today.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const totalSpentInPeriod = periodTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const averageDailySpend = totalSpentInPeriod / daysElapsed;

  // Calculate remaining days in current period
  const remainingDays = Math.ceil(
    (currentPeriodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Calculate days until budget runs out
  let daysToRunOut: number | null = null;
  if (averageDailySpend > 0 && remaining > 0) {
    daysToRunOut = Math.floor(remaining / averageDailySpend);
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  const percentageUsed = (budget.spent / budget.allocated) * 100;
  const percentageTimeElapsed =
    (daysElapsed / (daysElapsed + remainingDays)) * 100;

  if (remaining <= 0) {
    riskLevel = "critical";
  } else if (daysToRunOut !== null && daysToRunOut <= 3) {
    riskLevel = "critical";
  } else if (percentageUsed > percentageTimeElapsed + 20) {
    riskLevel = "high";
  } else if (percentageUsed > percentageTimeElapsed + 10) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  return {
    riskLevel,
    daysToRunOut,
    averageDailySpend,
    remainingDays,
  };
};

export const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case "critical":
      return "text-red-600";
    case "high":
      return "text-orange-600";
    case "medium":
      return "text-yellow-600";
    default:
      return "text-green-600";
  }
};

export const getRiskLevelText = (riskLevel: string): string => {
  switch (riskLevel) {
    case "critical":
      return "Critical Risk";
    case "high":
      return "High Risk";
    case "medium":
      return "Medium Risk";
    default:
      return "Low Risk";
  }
};
