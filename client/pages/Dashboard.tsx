import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Calendar,
  AlertTriangle,
  Upload,
  BarChart3,
  ChevronRight,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ComparisonBarChart } from "../components/ui/simple-chart";
import { TransactionForm } from "../components/forms/TransactionForm";
import { GoalForm } from "../components/forms/GoalForm";
import { useCurrency } from "../hooks/useCurrency";

export default function Dashboard() {
  const { userData } = useUser();
  const { currencySymbol, formatAmount } = useCurrency();
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const [selectedInsightCategory, setSelectedInsightCategory] =
    useState("expense");
  const [viewMode, setViewMode] = useState<"goals" | "budgets">("goals");

  // Refs for height synchronization
  const spendingBreakdownRef = useRef<HTMLDivElement>(null);
  const goalsProgressRef = useRef<HTMLDivElement>(null);

  // Check if user has any data
  const hasData =
    userData.transactions.length > 0 ||
    userData.goals.length > 0 ||
    userData.budgets.length > 0;

  // Calculate real-time dashboard data from user's transactions, budgets, and goals
  const dashboardData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter current month transactions
    const currentMonthTransactions = userData.transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Calculate total expenses for current month
    const totalExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total income for current month
    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate last month expenses for comparison
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = userData.transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === lastMonth &&
        transactionDate.getFullYear() === lastMonthYear
      );
    });

    const lastMonthExpenses = lastMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate savings
    const savings = totalIncome - totalExpenses;

    // Calculate category breakdown
    const categoryTotals: Record<string, number> = {};
    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    const categories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Find top category
    const topCategory = categories[0];

    // Calculate trends based on selectedPeriod
    const getTrendsData = () => {
      const trends = [];
      let periodsCount = 6;
      let periodUnit = "month";

      switch (selectedPeriod) {
        case "Week":
          periodsCount = 8;
          periodUnit = "week";
          break;
        case "Month":
          periodsCount = 12; // Show all 12 months of the year
          periodUnit = "month";
          break;
        case "Quarter":
          periodsCount = 4;
          periodUnit = "quarter";
          break;
        case "Year":
          periodsCount = 3;
          periodUnit = "year";
          break;
      }

      for (let i = 0; i < periodsCount; i++) {
        let periodStart, periodEnd, label, isCurrent;

        if (periodUnit === "week") {
          const weekStart = new Date();
          weekStart.setDate(
            weekStart.getDate() -
              (weekStart.getDay() + 7 * (periodsCount - 1 - i)),
          );
          weekStart.setHours(0, 0, 0, 0);
          periodStart = weekStart;
          periodEnd = new Date(weekStart);
          periodEnd.setDate(periodEnd.getDate() + 6);
          periodEnd.setHours(23, 59, 59, 999);
          label = `W${Math.ceil(weekStart.getDate() / 7)}`;
          isCurrent = periodsCount - 1 - i === 0;
        } else if (periodUnit === "month") {
          // Show months from January to December of current year
          const monthIndex = i; // January = 0, February = 1, etc.
          const monthDate = new Date(currentYear, monthIndex, 1);
          periodStart = monthDate;
          periodEnd = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            0,
          );
          label = monthDate.toLocaleDateString("en-US", { month: "short" });
          isCurrent =
            monthDate.getMonth() === currentMonth &&
            monthDate.getFullYear() === currentYear;
        } else if (periodUnit === "quarter") {
          const quarterStart = new Date(
            currentYear,
            Math.floor(currentMonth / 3) * 3 - (periodsCount - 1 - i) * 3,
            1,
          );
          periodStart = quarterStart;
          periodEnd = new Date(
            quarterStart.getFullYear(),
            quarterStart.getMonth() + 3,
            0,
          );
          label = `Q${Math.floor(quarterStart.getMonth() / 3) + 1}`;
          isCurrent = periodsCount - 1 - i === 0;
        } else if (periodUnit === "year") {
          const yearStart = new Date(
            currentYear - (periodsCount - 1 - i),
            0,
            1,
          );
          periodStart = yearStart;
          periodEnd = new Date(currentYear - (periodsCount - 1 - i), 11, 31);
          label = yearStart.getFullYear().toString();
          isCurrent = periodsCount - 1 - i === 0;
        }

        const periodTransactions = userData.transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= periodStart && transactionDate <= periodEnd;
        });

        const periodExpenses = periodTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        const periodIncome = periodTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        trends.push({
          month: label,
          income: periodIncome,
          expense: periodExpenses,
          isCurrentMonth: isCurrent,
        });
      }

      return trends;
    };

    const monthlyTrends = getTrendsData();

    // Generate insights
    const insights = [];
    const percentageChange =
      lastMonthExpenses > 0
        ? ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;

    if (totalExpenses === 0) {
      insights.push("Start adding transactions to see your spending insights");
    } else {
      if (percentageChange < -5) {
        insights.push(
          `You've spent ${Math.abs(percentageChange).toFixed(1)}% less than last month - great job!`,
        );
      } else if (percentageChange > 5) {
        insights.push(
          `Your spending increased by ${percentageChange.toFixed(1)}% this month`,
        );
      } else {
        insights.push(
          "Your spending is relatively stable compared to last month",
        );
      }

      if (topCategory) {
        insights.push(
          `${topCategory.name} is your top spending category at ${currencySymbol}${topCategory.amount.toFixed(2)}`,
        );
      }

      if (savings > 0) {
        insights.push(
          `You're on track to save ${currencySymbol}${savings.toFixed(2)} this month`,
        );
      } else if (savings < 0) {
        insights.push(
          `You're overspending by ${currencySymbol}${Math.abs(savings).toFixed(2)} this month`,
        );
      }
    }

    return {
      totalExpenses,
      lastMonthExpenses,
      savings,
      topCategory: topCategory?.name || "No expenses",
      topCategoryAmount: topCategory?.amount || 0,
      categories,
      monthlyTrends,
      goals: userData.goals, // Show all goals
      insights: insights.slice(0, 3), // Show first 3 insights
      percentageChange,
    };
  }, [userData.transactions, userData.goals, selectedPeriod]);

  // Height synchronization effect
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    const syncHeights = () => {
      if (
        window.innerWidth >= 1024 &&
        spendingBreakdownRef.current &&
        goalsProgressRef.current
      ) {
        // Force a reflow to get accurate heights
        requestAnimationFrame(() => {
          if (spendingBreakdownRef.current && goalsProgressRef.current) {
            const spendingHeight =
              spendingBreakdownRef.current.getBoundingClientRect().height;
            const goalsContainer = goalsProgressRef.current.querySelector(
              ".goals-progress-container",
            ) as HTMLElement;

            if (goalsContainer) {
              // Calculate available height for goals content
              const goalsHeader = goalsProgressRef.current.querySelector(
                ".goals-header-height",
              ) as HTMLElement;
              const headerHeight = goalsHeader
                ? goalsHeader.getBoundingClientRect().height
                : 0;
              const cardPadding = 48; // CardContent padding
              const availableHeight = Math.max(
                spendingHeight - headerHeight - cardPadding,
                200,
              );

              goalsContainer.style.maxHeight = `${availableHeight}px`;
              goalsContainer.style.height = `${availableHeight}px`;
            }
          }
        });
      } else if (goalsProgressRef.current) {
        // Reset for mobile
        const goalsContainer = goalsProgressRef.current.querySelector(
          ".goals-progress-container",
        ) as HTMLElement;
        if (goalsContainer) {
          goalsContainer.style.maxHeight = "400px";
          goalsContainer.style.height = "auto";
        }
      }
    };

    // Initial sync
    setTimeout(syncHeights, 100);

    // Set up ResizeObserver for automatic height updates
    if (spendingBreakdownRef.current) {
      resizeObserver = new ResizeObserver(syncHeights);
      resizeObserver.observe(spendingBreakdownRef.current);
    }

    // Add resize listener for responsive changes
    window.addEventListener("resize", syncHeights);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", syncHeights);
    };
  }, [dashboardData.categories.length, dashboardData.goals.length]);

  // Helper function to get category colors
  function getCategoryColor(category: string) {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    const index = category.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              {hasData
                ? "Your financial overview"
                : "Start by adding your first transaction or goal"}
            </p>
          </div>
          <Button
            onClick={() => navigate("/learn")}
            className="learn-btn !bg-blue-500 hover:!bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="default"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learn
          </Button>
        </div>

        {/* Empty State for New Users */}
        {!hasData && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Get Started with TurboCash
              </h3>
              <p className="text-muted-foreground mb-8">
                Add your first transaction or set a financial goal to begin
                tracking your finances.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Your First Transaction
                </Button>
                <Button
                  onClick={() => setShowGoalForm(true)}
                  variant="outline"
                  className="border-teal-500 text-teal-600"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Your First Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content - Only show when user has data */}
        {hasData && (
          <>
            {/* Quick Actions */}
            <div className="mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => setShowTransactionForm(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white h-9"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
                    <Button
                      onClick={() => setShowGoalForm(true)}
                      variant="outline"
                      className="border-teal-500 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20 h-9"
                      size="sm"
                    >
                      Set New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Expenses
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {formatAmount(dashboardData.totalExpenses)}
                      </p>
                      {dashboardData.totalExpenses > 0 ? (
                        <p
                          className={`text-sm flex items-center gap-1 ${
                            dashboardData.percentageChange < 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {dashboardData.percentageChange < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          {Math.abs(dashboardData.percentageChange).toFixed(1)}%
                          vs last month
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          This month
                        </p>
                      )}
                    </div>
                    <DollarSign className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Money Saved
                      </p>
                      <p
                        className={`text-xl font-bold ${dashboardData.savings >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {dashboardData.savings >= 0 ? "+" : ""}
                        {formatAmount(Math.abs(dashboardData.savings))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This month
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Top Category
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {dashboardData.topCategory}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatAmount(dashboardData.topCategoryAmount)}
                      </p>
                    </div>
                    <PieChart className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Active Goals
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {userData.goals.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In progress
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="dashboard-section-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Spending Breakdown */}
              <Card
                ref={spendingBreakdownRef}
                className="border-0 shadow-md dashboard-section-card"
              >
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="dashboard-section-content p-6">
                  <div className="space-y-3">
                    {dashboardData.categories.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto scrollbar-thin pr-2">
                        <div className="space-y-3">
                          {dashboardData.categories.map((category, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full ${category.color} shadow-sm`}
                                ></div>
                                <span className="text-sm text-foreground font-medium">
                                  {category.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-foreground">
                                  {formatAmount(category.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {category.percentage.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No expenses this month yet
                      </div>
                    )}
                  </div>
                  {dashboardData.categories.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs text-muted-foreground mb-2">
                        Spending Distribution
                      </p>
                      <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner flex">
                        {dashboardData.categories.map((category, index) => (
                          <div
                            key={index}
                            className={`${category.color} transition-all duration-300 hover:opacity-80`}
                            style={{ width: `${category.percentage}%` }}
                            title={`${category.name}: ${category.percentage.toFixed(1)}%`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Goals & Budgets Progress */}
              <Card
                ref={goalsProgressRef}
                className="border-0 shadow-md dashboard-section-card"
              >
                <CardHeader className="flex-shrink-0 goals-header-height">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      {viewMode === "goals"
                        ? `Goals Progress (${dashboardData.goals.length})`
                        : `Budgets (${userData.budgets.length})`}
                    </CardTitle>
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode("goals")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          viewMode === "goals"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        Goals
                      </button>
                      <button
                        onClick={() => setViewMode("budgets")}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          viewMode === "budgets"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        Budgets
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="dashboard-section-content">
                  <div className="goals-progress-container space-y-4 pr-2 scrollbar-thin">
                    {viewMode === "goals" ? (
                      dashboardData.goals.length > 0 ? (
                        dashboardData.goals.map((goal, index) => {
                          const percentage = Math.min(
                            (goal.currentAmount / goal.targetAmount) * 100,
                            100,
                          );
                          return (
                            <div
                              key={index}
                              className="bg-muted/50 p-4 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-foreground text-sm truncate">
                                  {goal.name}
                                </h3>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 mb-2">
                                <div
                                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{formatAmount(goal.currentAmount)}</span>
                                <span>{formatAmount(goal.targetAmount)}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No goals set yet
                        </div>
                      )
                    ) : userData.budgets.length > 0 ? (
                      userData.budgets.map((budget, index) => {
                        // Calculate spent amount based on budget period
                        const currentSpent = userData.transactions
                          .filter((t) => {
                            const transactionDate = new Date(t.date);
                            const budgetStartDate = new Date(budget.startDate);
                            const today = new Date();

                            // Determine the period boundaries
                            let periodStart: Date;
                            let periodEnd: Date;

                            if (budget.period === "weekly") {
                              // Current week
                              periodStart = new Date(today);
                              periodStart.setDate(
                                today.getDate() - today.getDay(),
                              );
                              periodEnd = new Date(periodStart);
                              periodEnd.setDate(periodStart.getDate() + 6);
                            } else if (budget.period === "monthly") {
                              // Current month
                              periodStart = new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                1,
                              );
                              periodEnd = new Date(
                                today.getFullYear(),
                                today.getMonth() + 1,
                                0,
                              );
                            } else {
                              // yearly
                              // Current year
                              periodStart = new Date(today.getFullYear(), 0, 1);
                              periodEnd = new Date(today.getFullYear(), 11, 31);
                            }

                            return (
                              t.type === "expense" &&
                              t.category === budget.category &&
                              transactionDate >= periodStart &&
                              transactionDate <= periodEnd
                            );
                          })
                          .reduce((sum, t) => sum + (t.amount || 0), 0);
                        const budgetAmount = budget.allocated || 0;
                        const percentage =
                          budgetAmount > 0
                            ? Math.min((currentSpent / budgetAmount) * 100, 100)
                            : 0;
                        const isOverBudget = currentSpent > budgetAmount;

                        return (
                          <div
                            key={index}
                            className="bg-muted/50 p-4 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-foreground text-sm truncate">
                                {budget.category}
                              </h3>
                              <span
                                className={`text-xs ml-2 ${
                                  isOverBudget
                                    ? "text-red-600"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {budgetAmount > 0
                                  ? percentage.toFixed(1)
                                  : "0.0"}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isOverBudget ? "bg-red-500" : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatAmount(currentSpent)}</span>
                              <span>{formatAmount(budgetAmount)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No budgets set yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Spending Insights - Same size as Spending Breakdown */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    Spending Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {/* Period Selector */}
                  <div className="flex gap-1 mb-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    {["Week", "Month", "Quarter", "Year"].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          selectedPeriod === period
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>

                  {/* Monthly Cards - Horizontally Scrollable */}
                  <div className="overflow-x-auto pb-2 scrollbar-thin">
                    <div className="flex gap-2 min-w-max">
                      {dashboardData.monthlyTrends.map((trend, index) => {
                        const maxValue = Math.max(
                          ...dashboardData.monthlyTrends.map((t) =>
                            Math.max(t.income, t.expense),
                          ),
                        );
                        const incomeHeight =
                          maxValue > 0 ? (trend.income / maxValue) * 100 : 0;
                        const expenseHeight =
                          maxValue > 0 ? (trend.expense / maxValue) * 100 : 0;

                        return (
                          <div
                            key={index}
                            className={`flex-shrink-0 w-16 p-2 rounded-lg border transition-all ${
                              trend.isCurrentMonth
                                ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            }`}
                          >
                            {/* Month Label */}
                            <div className="text-center mb-2">
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {trend.month}
                              </p>
                            </div>

                            {/* Chart Bars */}
                            <div className="flex items-end justify-center gap-1 h-12 mb-1">
                              <div
                                className="w-1.5 bg-green-500 dark:bg-green-400 rounded-t-sm transition-all duration-300"
                                style={{
                                  height: `${Math.max(incomeHeight, 2)}%`,
                                }}
                                title={`Income: ${formatAmount(trend.income)}`}
                              />
                              <div
                                className="w-1.5 bg-red-500 dark:bg-red-400 rounded-t-sm transition-all duration-300"
                                style={{
                                  height: `${Math.max(expenseHeight, 2)}%`,
                                }}
                                title={`Spending: ${formatAmount(trend.expense)}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Cards - Compact */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                          Earnings
                        </span>
                      </div>
                      <p className="text-sm font-bold text-green-800 dark:text-green-200">
                        {formatAmount(
                          dashboardData.monthlyTrends.find(
                            (t) => t.isCurrentMonth,
                          )?.income || 0,
                        )}
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">
                          Total Spend
                        </span>
                      </div>
                      <p className="text-sm font-bold text-red-800 dark:text-red-200">
                        {formatAmount(
                          dashboardData.monthlyTrends.find(
                            (t) => t.isCurrentMonth,
                          )?.expense || 0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights - Same size as Goals Progress */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {dashboardData.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="relative flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                            {insight}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add some visual padding if there are fewer insights */}
                    {dashboardData.insights.length < 3 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        </div>
                        <p className="text-sm">
                          {dashboardData.insights.length === 0
                            ? "Add some transactions to see personalized insights"
                            : "Keep tracking your finances to unlock more insights"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Form Modals */}
        <TransactionForm
          isOpen={showTransactionForm}
          onClose={() => setShowTransactionForm(false)}
          onSuccess={() => {
            // Transaction added successfully
          }}
        />

        <GoalForm
          isOpen={showGoalForm}
          onClose={() => setShowGoalForm(false)}
          onSuccess={() => {
            // Goal created successfully
          }}
        />
      </div>
    </div>
  );
}
