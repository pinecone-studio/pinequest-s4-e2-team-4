import type { ChecklistItem } from "./checklistTypes";
import {
  notificationsStorageKey,
  unreadChecklistStorageKey,
  type MonTripNotification,
  type NotificationType,
} from "./heroNotificationTypes";

export function getStoredNotifications() {
  try {
    const stored = localStorage.getItem(notificationsStorageKey);
    if (!stored) return [];

    return JSON.parse(stored) as MonTripNotification[];
  } catch {
    return [];
  }
}

export function saveStoredNotifications(notifications: MonTripNotification[]) {
  localStorage.setItem(notificationsStorageKey, JSON.stringify(notifications));
  localStorage.setItem(
    unreadChecklistStorageKey,
    String(notifications.filter((notification) => !notification.read).length),
  );
}

export function buildNotificationId(
  type: NotificationType,
  sessionId: string | null,
  departureAt: Date,
  uncheckedItems: ChecklistItem[],
) {
  const itemKey = uncheckedItems
    .map((item) => item.id)
    .sort()
    .join("-");

  return `${type}-${sessionId || "latest"}-${departureAt.toISOString()}-${itemKey}`;
}
