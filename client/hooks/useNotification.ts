import { useState } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showSuccess = (title: string, message: string) => {
    return addNotification({ type: "success", title, message });
  };

  const showError = (title: string, message: string) => {
    return addNotification({ type: "error", title, message });
  };

  const showWarning = (title: string, message: string) => {
    return addNotification({ type: "warning", title, message });
  };

  const showInfo = (title: string, message: string) => {
    return addNotification({ type: "info", title, message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
