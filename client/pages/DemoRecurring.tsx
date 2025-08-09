import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Tv,
  Music,
  Film,
  ArrowLeft,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoRecurring() {
  // Demo subscription data
  const demoSubscriptions = [
    {
      id: "1",
      name: "Netflix Premium",
      platform: "netflix",
      platformName: "Netflix",
      amount: 649,
      billableMonths: 1,
      purchaseDate: "2024-01-15",
      nextRenewal: "2024-04-15",
      isActive: true,
      icon: Tv,
    },
    {
      id: "2",
      name: "Spotify Premium",
      platform: "spotify",
      platformName: "Spotify",
      amount: 119,
      billableMonths: 1,
      purchaseDate: "2024-02-01",
      nextRenewal: "2024-04-01",
      isActive: true,
      icon: Music,
    },
    {
      id: "3",
      name: "Amazon Prime",
      platform: "prime",
      platformName: "Amazon Prime",
      amount: 1499,
      billableMonths: 12,
      purchaseDate: "2024-01-01",
      nextRenewal: "2025-01-01",
      isActive: true,
      icon: Film,
    },
  ];

  // Calculate totals
  const totalMonthlySpend = demoSubscriptions.reduce((sum, sub) => {
    const monthlyAmount = sub.amount / sub.billableMonths;
    return sum + monthlyAmount;
  }, 0);

  const totalYearlySpend = totalMonthlySpend * 12;

  // Get days until renewal
  const getDaysUntilRenewal = (nextRenewal: string) => {
    const renewalDate = new Date(nextRenewal);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if renewal is coming soon (within 7 days)
  const isRenewalSoon = (nextRenewal: string) => {
    const renewalDate = new Date(nextRenewal);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const upcomingRenewals = demoSubscriptions.filter((sub) =>
    isRenewalSoon(sub.nextRenewal),
  );

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
                  You're viewing sample subscription data. Sign up to track your
                  real subscriptions and get renewal alerts!
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
            Recurring Subscriptions
          </h1>
          <p className="text-muted-foreground">
            Track your subscriptions and get alerts before renewal dates.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Active Subscriptions
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {demoSubscriptions.length}
                  </p>
                </div>
                <Tv className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Monthly Spend
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{Math.round(totalMonthlySpend).toLocaleString()}
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
                    Yearly Impact
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{Math.round(totalYearlySpend).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Renewal Alerts
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {upcomingRenewals.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Next 7 days</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {demoSubscriptions.map((subscription) => {
            const daysUntilRenewal = getDaysUntilRenewal(
              subscription.nextRenewal,
            );
            const isExpiringSoon = isRenewalSoon(subscription.nextRenewal);
            const IconComponent = subscription.icon;

            return (
              <Card key={subscription.id} className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-teal-500" />
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          {subscription.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {subscription.platformName}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Demo
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Amount and Billing */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold text-foreground">
                          ₹{subscription.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing:</span>
                        <span className="text-foreground">
                          Every {subscription.billableMonths} month
                          {subscription.billableMonths > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Cost:
                        </span>
                        <span className="text-foreground">
                          ₹
                          {Math.round(
                            subscription.amount / subscription.billableMonths,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Renewal Information */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">
                          Next Renewal:
                        </span>
                        <span className="text-foreground">
                          {new Date(
                            subscription.nextRenewal,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Days Left:
                        </span>
                        <span
                          className={`font-medium ${
                            isExpiringSoon
                              ? "text-red-600"
                              : daysUntilRenewal <= 30
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {daysUntilRenewal > 0
                            ? `${daysUntilRenewal} days`
                            : "Expired"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge and Actions */}
                    <div className="flex flex-col items-center gap-3">
                      {isExpiringSoon ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Renewal Due Soon
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </div>
                      )}

                      {/* Demo Cancel Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert('This is a demo! Cancel buttons redirect to actual platform cancellation pages in the full version.')}
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Cancel Subscription
                      </Button>
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
                Ready to track your real subscriptions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up for TurboCash and never miss a renewal date again. Get
                alerts, track spending, and manage all your subscriptions in one
                place.
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
