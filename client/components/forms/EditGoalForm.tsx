import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useUser } from "../../contexts/UserContext";
import { getCurrencySymbol } from "../../lib/utils";

interface Goal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  userId: string;
}

interface EditGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSuccess?: () => void;
}

export function EditGoalForm({
  isOpen,
  onClose,
  goal,
  onSuccess,
}: EditGoalFormProps) {
  const { updateGoal, userData } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount.toString(),
        deadline: goal.deadline,
        category: goal.category,
        priority: goal.priority,
      });
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setError("");
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.targetAmount ||
        !formData.deadline ||
        !formData.category
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const targetAmount = parseFloat(formData.targetAmount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        setError("Please enter a valid target amount");
        return;
      }

      // Check if deadline is in the future
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        setError("Please select a future date for the deadline");
        return;
      }

      updateGoal(goal.id, {
        name: formData.name,
        description: formData.description,
        targetAmount,
        deadline: formData.deadline,
        category: formData.category,
        priority: formData.priority,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to update goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!goal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Emergency Fund, Vacation"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="What is this goal for?"
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="targetAmount">
              Target Amount ({getCurrencySymbol(userData.user?.currency)})
            </Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.targetAmount}
              onChange={(e) =>
                handleInputChange("targetAmount", e.target.value)
              }
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="deadline">Target Date</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "high" | "medium" | "low") =>
                handleInputChange("priority", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-teal-500 hover:bg-teal-600"
            >
              {isLoading ? "Updating..." : "Update Goal"}
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
