import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "./button";

interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: (id: string) => void;
}

export function Notification({
  id,
  type,
  title,
  message,
  onClose,
}: NotificationProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "warning":
        return "text-yellow-800 dark:text-yellow-200";
      case "info":
        return "text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div
      className={`flex items-start p-4 rounded-lg border ${getBgColor()} shadow-lg animate-in slide-in-from-right duration-300`}
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${getTextColor()}`}>{title}</h4>
        <p className={`text-sm mt-1 ${getTextColor()}`}>{message}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => onClose(id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>;
  onClose: (id: string) => void;
}

export function NotificationContainer({
  notifications,
  onClose,
}: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
