import type { ChecklistItem } from "./checklistTypes";
import {
  activeChatSessionStorageKey,
  alarmDateStorageKey,
  alarmSetStorageKey,
  alarmTimeStorageKey,
  alarmTriggeredAtStorageKey,
  twelveHoursMs,
  type ChecklistResult,
} from "./heroNotificationTypes";

export async function fetchUncheckedChecklistItems(): Promise<
  ChecklistResult | undefined
> {
  const sessionId = localStorage.getItem(activeChatSessionStorageKey);
  const response = await fetch(
    sessionId
      ? `/api/checklist?sessionId=${encodeURIComponent(sessionId)}`
      : "/api/checklist",
    { credentials: "include" },
  );
  if (!response.ok) return;

  const checklistItems = (await response.json()) as ChecklistItem[];
  return {
    sessionId,
    uncheckedItems: checklistItems.filter((item) => !item.isCompleted),
  };
}

export function getStoredAlarmDateTime() {
  const alarmDate = localStorage.getItem(alarmDateStorageKey);
  const alarmTime = localStorage.getItem(alarmTimeStorageKey);
  if (!alarmDate || !alarmTime) return null;

  const date = new Date(`${alarmDate}T${alarmTime}:00`);
  if (Number.isNaN(date.getTime())) return null;

  return {
    alarmDate,
    alarmKey: `${alarmDate}T${alarmTime}`,
    alarmTime,
    date,
  };
}

export function getDueReminderDate() {
  const alarm = getStoredAlarmDateTime();
  if (!alarm) return null;

  const now = new Date();
  const reminderAt = new Date(alarm.date.getTime() - twelveHoursMs);
  if (now < reminderAt || now > alarm.date) return null;

  return alarm.date;
}

export function consumeDueAlarmDate() {
  const alarm = getStoredAlarmDateTime();
  if (!alarm) return null;

  const now = new Date();
  const isAlarmSet = localStorage.getItem(alarmSetStorageKey) === "true";
  const triggeredAt = localStorage.getItem(alarmTriggeredAtStorageKey);
  const shouldNotify = (isAlarmSet && now >= alarm.date) || triggeredAt === alarm.alarmKey;

  if (!shouldNotify || now.getTime() - alarm.date.getTime() > 5 * 60_000) return null;

  localStorage.setItem(alarmSetStorageKey, "false");
  localStorage.removeItem(alarmTriggeredAtStorageKey);
  return alarm.date;
}
