"use client";

import { formatTimestampToReadable } from "@/src/utils/date";
import { IconChecks, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Spinner from "@/src/shared/components/spinner";
import { useNotifications } from "../hooks/use-notifications";

const NotificationCard = () => {
  const {
    notifications,
    isDeleting,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const handleDeleteSingle = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };

  return (
    <section className="scrollbar-hide relative flex max-h-[600px] min-h-[300px] min-w-[350px] scroll-m-2 flex-col overflow-auto scroll-smooth rounded-[15px] border border-white/20 bg-white px-2 py-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-lg">
      <div className="mb-5 flex w-full flex-col items-end justify-end">
        <button
          className="group flex items-center gap-2"
          onClick={handleDeleteAll}
          disabled={isDeleting || notifications.length === 0}
        >
          <div className="font-grotesk text-xs text-gray-400 capitalize">
            <p>Mark all as read</p>
          </div>
          <IconChecks
            width={20}
            height={20}
            className="group-hover:scale-105 group-active:scale-95"
          />
        </button>
      </div>
      <div className="relative z-10 flex w-full flex-col gap-5">
        {notifications.length < 1 && (
          <h3 className="font-bebas self-center text-sm font-medium tracking-wider text-neutral-600">
            All caught up
          </h3>
        )}

        {notifications.length > 0 &&
          notifications.map((notification, index) => (
            <div className="flex w-full flex-col gap-2" key={notification.id}>
              <div
                className="motion-preset-blur-down motion-duration-700 flex items-center gap-5"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 mask-auto p-2">
                  <Image
                    src={notification.image}
                    alt={`notification_image`}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1 capitalize">
                  <h3 className="font-grotesk text-[12px] font-bold sm:text-sm">
                    {notification.content}
                  </h3>
                  <p className="font-grotesk text-[9px] text-gray-400 sm:text-xs">
                    {formatTimestampToReadable(notification.createdAt)}
                  </p>
                </div>

                {notification.secondaryImage && (
                  <Image
                    src={notification.secondaryImage}
                    alt={`notification_image`}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}

                <button
                  onClick={() => handleDeleteSingle(notification.id)}
                  disabled={isDeleting}
                  className="group flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 disabled:opacity-50"
                >
                  <IconX
                    width={12}
                    height={12}
                    className="text-gray-400 group-hover:text-red-500"
                  />
                </button>
              </div>
              <hr className="w-full border-t border-gray-200" />
            </div>
          ))}
      </div>
    </section>
  );
};

export default NotificationCard;
