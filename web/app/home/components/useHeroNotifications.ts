"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  consumeDueAlarmDate,
  fetchUncheckedChecklistItems,
  getDueReminderDate,
} from "./heroNotificationScheduler";
import {
  buildNotificationId,
  getStoredNotifications,
  saveStoredNotifications,
} from "./heroNotificationStorage";
import {
  activeChatSessionStorageKey,
  type CreateChecklistNotificationInput,
  type MonTripNotification,
} from "./heroNotificationTypes";
import { playNotificationSound } from "./playNotificationSound";
import { getStoredLanguage } from "@/app/lib/language";
import { translateChecklistText } from "@/app/lib/checklistTranslations";

export function useHeroNotifications() {
  const [notifications, setNotifications] = useState<MonTripNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<MonTripNotification | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const persistNotifications = useCallback((next: MonTripNotification[]) => {
    setNotifications(next);
    saveStoredNotifications(next);
  }, []);

  const createChecklistNotification = useCallback(
    async ({
      allowEmptyChecklist = false,
      departureAt,
      message,
      type,
    }: CreateChecklistNotificationInput) => {
      const checklistResult = await fetchUncheckedChecklistItems();
      if (!checklistResult && !allowEmptyChecklist) return;

      const sessionId =
        checklistResult?.sessionId ?? localStorage.getItem(activeChatSessionStorageKey);
      const uncheckedItems = checklistResult?.uncheckedItems ?? [];
      if (!allowEmptyChecklist && uncheckedItems.length === 0) return;

      const notificationId = buildNotificationId(
        type,
        sessionId,
        departureAt,
        uncheckedItems,
      );
      const existingNotifications = getStoredNotifications();
      if (existingNotifications.some((notification) => notification.id === notificationId)) {
        return;
      }

      const language = getStoredLanguage();
      const nextNotification: MonTripNotification = {
        id: notificationId,
        title: language === "en" ? "Trip checklist" : "Аяллын checklist",
        message,
        createdAt: new Date().toISOString(),
        itemTitles: uncheckedItems
          .slice(0, 3)
          .map((item) => translateChecklistText(item.title, language)),
        read: false,
        sessionId,
      };

      persistNotifications([nextNotification, ...existingNotifications].slice(0, 20));
      setToast(nextNotification);
      playNotificationSound();
      window.setTimeout(() => setToast(null), 5200);
    },
    [persistNotifications],
  );

  const checkChecklistReminders = useCallback(async () => {
    const departureAt = getDueReminderDate();
    if (!departureAt) return;

    await createChecklistNotification({
      departureAt,
      message:
        getStoredLanguage() === "en"
          ? "Some items are still unchecked. This is your 12-hour reminder before departure."
          : "Check хийгдээгүй зүйл үлдсэн байна. Гарахаас 12 цагийн өмнөх сануулга.",
      type: "reminder",
    });
  }, [createChecklistNotification]);

  const checkAlarmNotification = useCallback(async () => {
    const alarmAt = consumeDueAlarmDate();
    if (!alarmAt) return;

    await createChecklistNotification({
      allowEmptyChecklist: true,
      departureAt: alarmAt,
      message:
        getStoredLanguage() === "en"
          ? "It is time. Check your checklist and pack the remaining items."
          : "Цаг боллоо. Checklist-ээ шалгаад үлдсэн зүйлсээ бэлдээрэй.",
      type: "alarm",
    });
  }, [createChecklistNotification]);

  useEffect(() => {
    const runChecks = () => {
      void checkChecklistReminders();
      void checkAlarmNotification();
    };
    const timer = window.setTimeout(() => {
      setNotifications(getStoredNotifications());
      runChecks();
    }, 0);
    const interval = window.setInterval(runChecks, 3_000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [checkAlarmNotification, checkChecklistReminders]);

  const openNotifications = () => {
    setIsOpen(true);
    persistNotifications(
      getStoredNotifications().map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (notificationId: string) => {
    persistNotifications(
      getStoredNotifications().filter((notification) => notification.id !== notificationId),
    );
  };

  return {
    deleteNotification,
    isOpen,
    notifications,
    openNotifications,
    setIsOpen,
    setToast,
    toast,
    unreadCount,
  };
}
