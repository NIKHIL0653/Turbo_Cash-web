import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Upload,
  Download,
  Filter,
  PieChart,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoAnalytics() {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  // Demo transactions data
  const demoTransactions = [
    {
      id: "1",
      date: "2024-03-20",
      description: "Restaurant",
      amount: 45,
      category: "Food & Dining",
      type: "expense",
    },
    {
      id: "2",
      date: "2024-03-18",
      description: "Amazon Purchase",
      amount: 89.99,
      category: "Shopping",
      type: "expense",
    },
    {
      id: "3",
      date: "2024-03-15",
      description: "Freelance Project",
      amount: 500,
      category: "Income",
      type: "income",
    },
    {
      id: "4",
      date: "2024-03-12",
      description: "Gas Station",
      amount: 55,
      category: "Transportation",
      type: "expense",
    },
    {
      id: "5",
      date: "2024-03-10",
      description: "Grocery Shopping",
      amount: 165,
      category: "Food & Dining",
      type: "expense",
    },
  ];

  const demoCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
  ];

  // Calculate analytics data from demo transactions
  const analyticsData = {
    totalExpenses: demoTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    totalIncome: demoTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    netSavings:
      demoTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0) -
      demoTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
  };

  // Filter transactions based on filters
  const filteredTransactions = demoTransactions.filter((transaction) => {
    if (
      categoryFilter !== "all" &&
      transaction.category.toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(
        `This is a demo! CSV file "${file.name}" would be uploaded and processed in the real app.`,
      );
    }
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
                  You're viewing sample analytics data. Sign up to track your
                  real expenses!
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
            Expense Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into your spending patterns and financial behavior.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-teal-500" />
                    <Label htmlFor="time-filter">Time Period:</Label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="category-filter">Category:</Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {demoCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category.toLowerCase()}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowUpload(!showUpload)}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="border-teal-500 text-teal-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {showUpload && (
                <div className="mt-6 p-4 border-2 border-dashed border-teal-300 rounded-lg bg-teal-50">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="text-navy-700 mb-2">
                      Upload your bank statement CSV (Demo)
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-teal-600 mt-2">
                      In demo mode - files won't be actually processed
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{analyticsData.totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{analyticsData.totalIncome.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Net Savings
                  </p>
                  <p
                    className={`text-2xl font-bold ${analyticsData.netSavings >= 0 ? "text-teal-600" : "text-red-600"}`}
                  >
                    ₹{analyticsData.netSavings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-500" />
              Recent Transactions
              {categoryFilter !== "all" && (
                <span className="text-sm font-normal text-muted-foreground">
                  (Filtered by {categoryFilter})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-foreground">
                      Description
                    </th>
                    <th className="text-left py-3 text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border">
                      <td className="py-3 text-sm text-muted-foreground">
                        {transaction.date}
                      </td>
                      <td className="py-3 text-sm text-foreground">
                        {transaction.description}
                      </td>
                      <td className="py-3">
                        <span className="inline-block px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-sm font-medium text-right ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="border-0 shadow-md bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to track your real expenses?
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up for TurboCash and start managing your finances with
                powerful analytics and insights.
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
