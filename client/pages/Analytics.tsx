import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useUser } from "../contexts/UserContext";
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
import { EditTransactionForm } from "../components/forms/EditTransactionForm";
import { TransactionForm } from "../components/forms/TransactionForm";
import { useNotification } from "../hooks/useNotification";
import { NotificationContainer } from "../components/ui/notification";
import { useCurrency } from "../hooks/useCurrency";
import {
  Filter,
  Calendar,
  PieChart,
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "expense" | "income";
}

// Helper function to get category colors
function getCategoryColor(category: string) {
  const categoryColors: Record<string, { bg: string; text: string }> = {
    "Food & Dining": { bg: "bg-red-100", text: "text-red-700" },
    Transportation: { bg: "bg-blue-100", text: "text-blue-700" },
    Shopping: { bg: "bg-green-100", text: "text-green-700" },
    Entertainment: { bg: "bg-yellow-100", text: "text-yellow-700" },
    "Bills & Utilities": { bg: "bg-purple-100", text: "text-purple-700" },
    Healthcare: { bg: "bg-pink-100", text: "text-pink-700" },
    Education: { bg: "bg-indigo-100", text: "text-indigo-700" },
    Travel: { bg: "bg-orange-100", text: "text-orange-700" },
    Other: { bg: "bg-gray-100", text: "text-gray-700" },
    Income: { bg: "bg-emerald-100", text: "text-emerald-700" },
  };

  return (
    categoryColors[category] || { bg: "bg-teal-100", text: "text-teal-700" }
  );
}

export default function Analytics() {
  const { userData, deleteTransaction, addTransaction } = useUser();
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    removeNotification,
    addNotification,
  } = useNotification();
  const { currencySymbol, formatAmount } = useCurrency();
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Check if user has any transactions
  const hasTransactions = userData.transactions.length > 0;

  // Debug: Check for duplicate IDs in transactions
  React.useEffect(() => {
    const ids = userData.transactions.map((t) => t.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn(
        "Duplicate transaction IDs detected:",
        ids.length,
        "vs",
        uniqueIds.size,
      );
      console.warn("All IDs:", ids);
      console.warn(
        "Duplicate IDs:",
        ids.filter((id, index) => ids.indexOf(id) !== index),
      );
    }
  }, [userData.transactions]);

  // Filter transactions based on filters
  const filteredTransactions = userData.transactions.filter((transaction) => {
    if (
      categoryFilter !== "all" &&
      transaction.category.toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setCategoryFilter(newFilter);
    setCurrentPage(1);
  };

  // Calculate analytics data from real user transactions
  const analyticsData = hasTransactions
    ? {
        totalExpenses: userData.transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
        totalIncome: userData.transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        netSavings:
          userData.transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0) -
          userData.transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0),
      }
    : {
        totalExpenses: 0,
        totalIncome: 0,
        netSavings: 0,
      };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(transactionId);
    }
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditingTransaction(null);
  };

  return (
    <>
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Expense Analytics
            </h1>
            <p className="text-muted-foreground">
              {hasTransactions
                ? "Deep insights into your spending patterns and financial behavior."
                : "Add transactions to see detailed analytics and spending insights."}
            </p>
          </div>

          {/* Empty State for New Users */}
          {!hasTransactions && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PieChart className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No Transaction Data Yet
                </h3>
                <p className="text-muted-foreground mb-8">
                  Add transactions to see detailed analytics and spending
                  insights.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowAddTransaction(true)}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Content - Only show when user has transactions */}
          {hasTransactions && (
            <>
              {/* Controls */}
              <div className="mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-teal-500" />
                          <Label htmlFor="time-filter">Time Period:</Label>
                          <Select
                            value={timeFilter}
                            onValueChange={setTimeFilter}
                          >
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
                            onValueChange={handleFilterChange}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {userData.categories.map((category) => (
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
                      <Button
                        onClick={() => setShowAddTransaction(true)}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                    </div>
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
                          {formatAmount(analyticsData.totalExpenses)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All time
                        </p>
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
                          {formatAmount(analyticsData.totalIncome)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All time
                        </p>
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
                          {formatAmount(analyticsData.netSavings)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All time
                        </p>
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
                    Recent Transactions ({sortedTransactions.length})
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
                        <tr className="border-b border-gray-200">
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
                          <th className="text-center py-3 text-sm font-semibold text-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction, index) => (
                          <tr
                            key={`${transaction.id}_${index}`}
                            className="border-b border-gray-100"
                          >
                            <td className="py-3 text-sm text-muted-foreground">
                              {transaction.date}
                            </td>
                            <td className="py-3 text-sm text-foreground">
                              {transaction.description}
                            </td>
                            <td className="py-3">
                              {(() => {
                                const colors = getCategoryColor(
                                  transaction.category,
                                );
                                return (
                                  <span
                                    className={`inline-block px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full`}
                                  >
                                    {transaction.category}
                                  </span>
                                );
                              })()}
                            </td>
                            <td
                              className={`py-3 text-sm font-medium text-right ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="py-3">
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-1"
                                  onClick={() =>
                                    handleEditTransaction(transaction)
                                  }
                                >
                                  <Edit className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-1"
                                  onClick={() =>
                                    handleDeleteTransaction(transaction.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, sortedTransactions.length)} of{" "}
                        {sortedTransactions.length} transactions
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Add Transaction Form */}
          <TransactionForm
            isOpen={showAddTransaction}
            onClose={() => setShowAddTransaction(false)}
            onSuccess={() => {
              setShowAddTransaction(false);
            }}
          />

          {/* Edit Transaction Form */}
          <EditTransactionForm
            isOpen={showEditForm}
            onClose={handleEditFormClose}
            transaction={editingTransaction}
            onSuccess={() => {
              // Refresh data if needed
            }}
          />
        </div>
      </div>
    </>
  );
}
