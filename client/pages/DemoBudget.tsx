import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoBudget() {
  // Demo budget data (3 cards as requested)
  const demoBudgets = [
    {
      id: "b1",
      category: "Food & Dining",
      allocated: 600,
      spent: 485,
      period: "monthly",
    },
    {
      id: "b2",
      category: "Transportation",
      allocated: 300,
      spent: 245,
      period: "monthly",
    },
    {
      id: "b3",
      category: "Bills & Utilities",
      allocated: 1300,
      spent: 1235,
      period: "monthly",
    },
  ];

  const totalAllocated = demoBudgets.reduce(
    (sum, budget) => sum + budget.allocated,
    0,
  );
  const totalSpent = demoBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;

  const getBudgetStatus = (budget: any) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return "exceeded";
    if (percentage >= 90) return "warning";
    if (percentage >= 75) return "caution";
    return "good";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exceeded":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      case "caution":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "exceeded":
        return "Over Budget";
      case "warning":
        return "Budget Alert";
      case "caution":
        return "Monitor Closely";
      default:
        return "On Track";
    }
  };

  const overBudgetCategories = demoBudgets.filter(
    (budget) => budget.spent > budget.allocated,
  );
  const warningCategories = demoBudgets.filter((budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    return percentage >= 90 && percentage < 100;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Demo Mode</h3>
                <p className="text-sm text-amber-700">
                  You're viewing sample budget data. Sign up to create and
                  manage your real budgets!
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  size="sm"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Budget Management
          </h1>
          <p className="text-muted-foreground">
            Track your spending against budgets and get alerts before
            overspending.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{totalAllocated.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <Target className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {((totalSpent / totalAllocated) * 100).toFixed(1)}% of
                    budget
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Remaining
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{Math.abs(remainingBudget).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {remainingBudget >= 0 ? "Available" : "Over budget"}
                  </p>
                </div>
                {remainingBudget >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {overBudgetCategories.length + warningCategories.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Categories need attention
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {(overBudgetCategories.length > 0 || warningCategories.length > 0) && (
          <Card className="border-0 shadow-md mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                Budget Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overBudgetCategories.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-100">
                        {budget.category}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Over budget by ₹
                        {(budget.spent - budget.allocated).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        ₹{budget.spent} / ₹{budget.allocated}
                      </p>
                      <p className="text-sm text-red-500">
                        {((budget.spent / budget.allocated) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
                {warningCategories.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-orange-900 dark:text-orange-100">
                        {budget.category}
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Approaching budget limit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        ₹{budget.spent} / ₹{budget.allocated}
                      </p>
                      <p className="text-sm text-orange-500">
                        {((budget.spent / budget.allocated) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {demoBudgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.allocated) * 100,
              100,
            );
            const status = getBudgetStatus(budget);
            const statusColor = getStatusColor(status);
            const statusText = getStatusText(status);

            return (
              <Card key={budget.id} className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {budget.category}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {budget.period} budget
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Demo
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${statusColor}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Amount Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spent:</span>
                        <span className="font-semibold text-foreground">
                          ₹{budget.spent.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-semibold text-foreground">
                          ₹{budget.allocated.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium text-foreground">
                          Remaining:
                        </span>
                        <span
                          className={`font-bold ${
                            budget.allocated - budget.spent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹
                          {Math.abs(budget.allocated - budget.spent).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}
                      >
                        {status === "good" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {statusText}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {budget.period}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-md bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to manage your real budgets?
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up for TurboCash and create custom budgets that help you
                stay on track with your financial goals.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/register">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
