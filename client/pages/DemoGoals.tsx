import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoGoals() {
  // Demo goals data (3 cards)
  const demoGoals = [
    {
      id: "g1",
      name: "Emergency Fund",
      description: "Save 6 months of expenses for financial security",
      targetAmount: 150000, // ₹1,50,000
      currentAmount: 85000, // ₹85,000
      deadline: "2024-12-31",
      category: "Emergency",
      priority: "high",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "g2",
      name: "Dream Vacation",
      description: "Two weeks in Europe with family",
      targetAmount: 200000, // ₹2,00,000
      currentAmount: 88000, // ₹88,000
      deadline: "2024-07-01",
      category: "Travel",
      priority: "medium",
      createdAt: "2024-01-15T00:00:00.000Z",
    },
    {
      id: "g3",
      name: "New Car",
      description: "Down payment for a reliable car",
      targetAmount: 300000, // ₹3,00,000
      currentAmount: 128000, // ₹1,28,000
      deadline: "2024-09-01",
      category: "Transportation",
      priority: "medium",
      createdAt: "2024-02-01T00:00:00.000Z",
    },
  ];

  const totalTargetAmount = demoGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0,
  );
  const totalCurrentAmount = demoGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0,
  );
  const totalProgress = (totalCurrentAmount / totalTargetAmount) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
                  You're viewing sample goal data. Sign up to create and track
                  your real financial goals!
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
            Financial Goals
          </h1>
          <p className="text-muted-foreground">
            Track your progress towards achieving your financial dreams and
            milestones.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Goals
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {demoGoals.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active goals</p>
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
                    Total Saved
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{totalCurrentAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {totalProgress.toFixed(1)}% of target
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Target
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{totalTargetAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remaining: ₹
                    {(totalTargetAmount - totalCurrentAmount).toLocaleString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {demoGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const progressColor = getProgressColor(progress);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const priorityColor = getPriorityColor(goal.priority);

            return (
              <Card key={goal.id} className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground mb-2">
                        {goal.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}
                      >
                        {goal.priority.toUpperCase()}
                      </span>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Demo
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${progressColor}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ₹{goal.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          ₹{goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-foreground font-medium">
                          {goal.category}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="text-foreground">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Days remaining:
                        </span>
                        <span
                          className={`font-medium ${
                            daysLeft < 30
                              ? "text-red-600"
                              : daysLeft < 90
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} days` : "Overdue"}
                        </span>
                      </div>

                      <div className="flex justify-between border-t pt-3">
                        <span className="text-muted-foreground">
                          Remaining needed:
                        </span>
                        <span className="font-bold text-foreground">
                          ₹
                          {(
                            goal.targetAmount - goal.currentAmount
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-center">
                      {progress >= 100 ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Goal Achieved!
                        </div>
                      ) : progress >= 75 ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
                          <TrendingUp className="w-4 h-4" />
                          Almost There!
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
                          <Target className="w-4 h-4" />
                          In Progress
                        </div>
                      )}
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
                Ready to achieve your financial goals?
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up for TurboCash and start tracking your progress towards
                your dreams with smart goal setting and progress monitoring.
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
