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
} from "lucide-react";
import { SimpleLineChart } from "../components/ui/simple-chart";
import { Link } from "react-router-dom";

export default function DemoDashboard() {
  // Mock demo data
  const mockData = {
    totalExpenses: 2456,
    lastMonth: 2801,
    savings: 544,
    topCategory: "Food",
    topCategoryAmount: 682,
    categories: [
      { name: "Food", amount: 682, color: "bg-red-500", percentage: 28 },
      { name: "Rent", amount: 1200, color: "bg-blue-500", percentage: 49 },
      { name: "Transport", amount: 245, color: "bg-green-500", percentage: 10 },
      { name: "Shopping", amount: 189, color: "bg-yellow-500", percentage: 8 },
      { name: "Other", amount: 140, color: "bg-purple-500", percentage: 5 },
    ],
    monthlyTrends: [
      { month: "Jan", amount: 2200 },
      { month: "Feb", amount: 2450 },
      { month: "Mar", amount: 2456 },
    ],
    goals: [
      {
        name: "Emergency Fund",
        target: 10000,
        current: 6500,
        percentage: 65,
      },
      {
        name: "Vacation",
        target: 3000,
        current: 1200,
        percentage: 40,
      },
    ],
    insights: [
      "You've spent 12% less than last month - great job!",
      "Food spending increased by 25% this month",
      "You're on track to save $600 this month",
    ],
  };

  const percentageChange =
    ((mockData.totalExpenses - mockData.lastMonth) / mockData.lastMonth) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-teal-800">
                Demo Dashboard
              </h2>
              <p className="text-sm text-teal-600">
                This is a preview with sample data. Sign up to start tracking
                your real finances!
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-600"
                >
                  ← Back to Home
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-navy-600">
            Here's what your financial overview could look like.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  disabled
                  className="bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Transaction (Demo Mode)
                </Button>
                <Button
                  disabled
                  variant="outline"
                  className="border-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Set New Goal (Demo Mode)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-navy-900">
                    ${mockData.totalExpenses.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      percentageChange < 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {percentageChange < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {Math.abs(percentageChange).toFixed(1)}% vs last month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Money Saved</p>
                  <p className="text-2xl font-bold text-green-600">
                    +${mockData.savings}
                  </p>
                  <p className="text-sm text-navy-500">This month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Top Category</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {mockData.topCategory}
                  </p>
                  <p className="text-sm text-navy-500">
                    ${mockData.topCategoryAmount}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Active Goals</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {mockData.goals.length}
                  </p>
                  <p className="text-sm text-navy-500">In progress</p>
                </div>
                <Target className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Spending Breakdown */}
          <Card className="border-0 shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-500" />
                Spending Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${category.color}`}
                      ></div>
                      <span className="text-navy-700 font-medium">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy-900">
                        ${category.amount}
                      </p>
                      <p className="text-sm text-navy-500">
                        {category.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex h-2 bg-gray-200 rounded-full overflow-hidden">
                {mockData.categories.map((category, index) => (
                  <div
                    key={index}
                    className={category.color}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-500" />
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockData.goals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-navy-900">{goal.name}</h3>
                      <span className="text-sm text-navy-600">
                        {goal.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-navy-600">
                      <span>${goal.current.toLocaleString()}</span>
                      <span>${goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                Monthly Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart
                data={mockData.monthlyTrends.map((trend) => ({
                  name: trend.month,
                  value: trend.amount,
                }))}
                height={250}
                color="#14b8a6"
              />
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-teal-500" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 bg-teal-50 border border-teal-200 rounded-lg"
                  >
                    <p className="text-navy-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to track your real finances?
          </h3>
          <p className="text-teal-100 mb-6">
            Sign up now to start managing your money with TurboCash
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
