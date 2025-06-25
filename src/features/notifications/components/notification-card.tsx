"use client";

import { formatTimestampToReadable } from "@/src/utils/date";
import { IconChecks, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useDeleteUserNotifications } from "../hooks/use-delete-user-notifications";
import Spinner from "@/src/shared/components/spinner";

interface NotificationProps {
  id: string | number;
  image: string;
  content: string;
  createdAt: number;
}

interface INotificationCard {
  data: NotificationProps[];
}

const NotificationCard: React.FC<INotificationCard> = ({ data }) => {
  const { mutateAsync: deleteNotifications, isPending } =
    useDeleteUserNotifications();

  const handleDeleteNotifications = async (notificationIds: string[]) => {
    await deleteNotifications({
      notificationIds,
    });
  };

  const handleDeleteSingle = async (notificationId: string) => {
    await handleDeleteNotifications([notificationId]);
  };

  const handleDeleteAll = async () => {
    const allIds = data.map((notification) => String(notification.id));
    await handleDeleteNotifications(allIds);
  };

  return (
    <section className="scrollbar-hide relative flex max-h-[600px] min-h-[300px] min-w-[300px] scroll-m-2 flex-col overflow-auto scroll-smooth rounded-[15px] border border-white/20 bg-white px-2 py-4 opacity-95 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),inset_0_1px_0_0_rgba(255,255,255,0.18)]">
      <div className="mb-5 flex w-full flex-col items-end justify-end">
        <button
          className="group flex items-center gap-2"
          onClick={handleDeleteAll}
          disabled={isPending}
        >
          <div className="font-grotesk text-xs text-gray-400 capitalize">
            {isPending ? (
              <Spinner borderColor="border-blue-600" />
            ) : (
              <p>Mark all as read</p>
            )}
          </div>
          <IconChecks
            width={20}
            height={20}
            className="group-hover:scale-105 group-active:scale-95"
          />
        </button>
      </div>
      <div className="relative z-10 flex w-full flex-col gap-5">
        {data.map((notification, index) => (
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
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1 capitalize">
                <h3 className="font-bricolage text-sm font-bold">
                  {notification.content}
                </h3>
                <p className="font-grotesk text-xs text-gray-400">
                  {formatTimestampToReadable(notification.createdAt)}
                </p>
              </div>

              <button
                onClick={() => handleDeleteSingle(String(notification.id))}
                disabled={isPending}
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
