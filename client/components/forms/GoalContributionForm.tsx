import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useUser } from "../../contexts/UserContext";
import { getCurrencySymbol } from "../../lib/utils";

interface GoalContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  goalName: string;
  onSuccess?: () => void;
}

export function GoalContributionForm({
  isOpen,
  onClose,
  goalId,
  goalName,
  onSuccess,
}: GoalContributionFormProps) {
  const { addGoalContribution, userData } = useUser();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const contributionAmount = parseFloat(amount);
      if (isNaN(contributionAmount) || contributionAmount <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      addGoalContribution(goalId, contributionAmount);

      // Reset form
      setAmount("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to add contribution. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-800">
              <strong>Goal:</strong> {goalName}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">
              Contribution Amount ({getCurrencySymbol(userData.user?.currency)})
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-teal-500 hover:bg-teal-600"
            >
              {isLoading ? "Adding..." : "Add Contribution"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
