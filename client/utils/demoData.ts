// Demo data setup for the demo account
export const setupDemoData = () => {
  const demoUser = {
    id: "demo_user",
    firstName: "Demo",
    lastName: "User",
    email: "demo@turbocash.com",
    password: "demo123",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  // Demo transactions for the last 3 months
  const demoTransactions = [
    // January 2024
    {
      id: "1",
      date: "2024-01-05",
      description: "Salary",
      amount: 3500,
      category: "Income",
      type: "income",
      userId: "demo_user",
    },
    {
      id: "2",
      date: "2024-01-01",
      description: "Rent Payment",
      amount: 1200,
      category: "Bills & Utilities",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "3",
      date: "2024-01-10",
      description: "Grocery Shopping",
      amount: 150,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "4",
      date: "2024-01-15",
      description: "Gas Station",
      amount: 60,
      category: "Transportation",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "5",
      date: "2024-01-20",
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      type: "expense",
      userId: "demo_user",
    },

    // February 2024
    {
      id: "6",
      date: "2024-02-05",
      description: "Salary",
      amount: 3500,
      category: "Income",
      type: "income",
      userId: "demo_user",
    },
    {
      id: "7",
      date: "2024-02-01",
      description: "Rent Payment",
      amount: 1200,
      category: "Bills & Utilities",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "8",
      date: "2024-02-08",
      description: "Grocery Shopping",
      amount: 180,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "9",
      date: "2024-02-12",
      description: "Coffee Shop",
      amount: 25,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "10",
      date: "2024-02-14",
      description: "Valentine's Dinner",
      amount: 120,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "11",
      date: "2024-02-18",
      description: "Gym Membership",
      amount: 50,
      category: "Healthcare",
      type: "expense",
      userId: "demo_user",
    },

    // March 2024
    {
      id: "12",
      date: "2024-03-05",
      description: "Salary",
      amount: 3500,
      category: "Income",
      type: "income",
      userId: "demo_user",
    },
    {
      id: "13",
      date: "2024-03-15",
      description: "Freelance Project",
      amount: 500,
      category: "Income",
      type: "income",
      userId: "demo_user",
    },
    {
      id: "14",
      date: "2024-03-01",
      description: "Rent Payment",
      amount: 1200,
      category: "Bills & Utilities",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "15",
      date: "2024-03-10",
      description: "Grocery Shopping",
      amount: 165,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "16",
      date: "2024-03-12",
      description: "Gas Station",
      amount: 55,
      category: "Transportation",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "17",
      date: "2024-03-15",
      description: "Amazon Purchase",
      amount: 89.99,
      category: "Shopping",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "18",
      date: "2024-03-20",
      description: "Restaurant",
      amount: 45,
      category: "Food & Dining",
      type: "expense",
      userId: "demo_user",
    },
    {
      id: "19",
      date: "2024-03-22",
      description: "Movie Tickets",
      amount: 30,
      category: "Entertainment",
      type: "expense",
      userId: "demo_user",
    },
  ];

  // Demo budgets (reduced to 3 cards)
  const demoBudgets = [
    {
      id: "b1",
      category: "Food & Dining",
      allocated: 600,
      spent: 485,
      period: "monthly",
      userId: "demo_user",
    },
    {
      id: "b2",
      category: "Transportation",
      allocated: 300,
      spent: 245,
      period: "monthly",
      userId: "demo_user",
    },
    {
      id: "b3",
      category: "Bills & Utilities",
      allocated: 1300,
      spent: 1235,
      period: "monthly",
      userId: "demo_user",
    },
  ];

  // Demo goals
  const demoGoals = [
    {
      id: "g1",
      name: "Emergency Fund",
      description: "Save 6 months of expenses for financial security",
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: "2024-12-31",
      category: "Emergency",
      priority: "high",
      createdAt: "2024-01-01T00:00:00.000Z",
      userId: "demo_user",
    },
    {
      id: "g2",
      name: "Dream Vacation",
      description: "Two weeks in Europe with family",
      targetAmount: 5000,
      currentAmount: 2200,
      deadline: "2024-07-01",
      category: "Travel",
      priority: "medium",
      createdAt: "2024-01-15T00:00:00.000Z",
      userId: "demo_user",
    },
    {
      id: "g3",
      name: "New Car",
      description: "Down payment for a reliable car",
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: "2024-09-01",
      category: "Transportation",
      priority: "medium",
      createdAt: "2024-02-01T00:00:00.000Z",
      userId: "demo_user",
    },
  ];

  const demoData = {
    user: demoUser,
    transactions: demoTransactions,
    budgets: demoBudgets,
    goals: demoGoals,
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
      "Income",
    ],
  };

  // Store demo user in users list
  const users = JSON.parse(localStorage.getItem("turbocash_users") || "[]");
  const existingDemo = users.find((u: any) => u.email === demoUser.email);
  if (!existingDemo) {
    users.push(demoUser);
    localStorage.setItem("turbocash_users", JSON.stringify(users));
  }

  // Store demo data
  localStorage.setItem(
    `turbocash_data_${demoUser.id}`,
    JSON.stringify(demoData),
  );

  return demoData;
};
