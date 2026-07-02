import type { ChecklistItem } from "./checklistTypes";

export type NotificationType = "reminder" | "alarm";

export type MonTripNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  itemTitles: string[];
  read: boolean;
  sessionId: string | null;
};

export type ChecklistResult = {
  sessionId: string | null;
  uncheckedItems: ChecklistItem[];
};

export type CreateChecklistNotificationInput = {
  allowEmptyChecklist?: boolean;
  departureAt: Date;
  message: string;
  type: NotificationType;
};

export const activeChatSessionStorageKey = "montrip-active-chat-session-id";
export const notificationsStorageKey = "montrip-notifications";
export const unreadChecklistStorageKey = "montrip-unread-checklist";
export const alarmDateStorageKey = "montrip-alarm-date";
export const alarmTimeStorageKey = "montrip-alarm-time";
export const alarmSetStorageKey = "montrip-alarm-set";
export const alarmTriggeredAtStorageKey = "montrip-alarm-triggered-at";
export const twelveHoursMs = 12 * 60 * 60 * 1000;
