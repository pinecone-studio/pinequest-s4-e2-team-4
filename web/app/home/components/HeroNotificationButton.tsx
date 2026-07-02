"use client";

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeroNotificationPanel from "./HeroNotificationPanel";
import HeroNotificationToast from "./HeroNotificationToast";
import { useHeroNotifications } from "./useHeroNotifications";

type HeroNotificationButtonProps = {
  onOpenChecklist: () => void;
};

export default function HeroNotificationButton({
  onOpenChecklist,
}: HeroNotificationButtonProps) {
  const {
    deleteNotification,
    isOpen,
    notifications,
    openNotifications,
    setIsOpen,
    setToast,
    toast,
    unreadCount,
  } = useHeroNotifications();

  const openChecklistFromNotification = () => {
    setIsOpen(false);
    setToast(null);
    onOpenChecklist();
  };

  return (
    <>
      <button
        type="button"
        onClick={openNotifications}
        aria-label="Notification харах"
        className="absolute right-5 top-14 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
      >
        <FontAwesomeIcon icon={faBell} className="h-4 w-4" />

        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
        )}
      </button>

      {toast && (
        <HeroNotificationToast
          notification={toast}
          onOpenChecklist={openChecklistFromNotification}
        />
      )}

      {isOpen && (
        <HeroNotificationPanel
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onDeleteNotification={deleteNotification}
          onOpenChecklist={openChecklistFromNotification}
        />
      )}
    </>
  );
}
