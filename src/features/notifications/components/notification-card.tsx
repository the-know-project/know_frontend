"use client";

import { formatTimestampToReadable } from "@/src/utils/date";
import { IconChecks, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useDeleteUserNotifications } from "../hooks/use-delete-user-notifications";
import { showLog } from "@/src/utils/logger";
import { AnimatePresence, motion } from "framer-motion";

interface NotificationProps {
  id: string | number;
  image: string;
  secondaryImage?: string | null;
  content: string;
  createdAt: number;
}

interface INotificationCard {
  data: NotificationProps[];
}

const NotificationCard: React.FC<INotificationCard> = ({ data }) => {
  const { mutateAsync: deleteNotifications } = useDeleteUserNotifications();

  showLog({
    context: "Nofication Card",
    data: data,
  });

  const handleDeleteNotifications = async (notificationIds: string[]) => {
    await deleteNotifications({
      notificationIds,
    });
  };

  const handleDeleteSingle = async (notificationId: string) => {
    await handleDeleteNotifications([notificationId]);
  };

  const handleDeleteAll = async () => {
    if (data.length > 0) {
      const allIds = data.map((notification) => String(notification.id));
      await handleDeleteNotifications(allIds);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="scrollbar-hide relative flex max-h-[600px] min-h-[300px] min-w-[350px] scroll-m-2 flex-col overflow-auto scroll-smooth rounded-[15px] border border-white/20 bg-white px-2 py-4 opacity-95 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),inset_0_1px_0_0_rgba(255,255,255,0.18)]">
      <div className="mb-5 flex w-full flex-col items-end justify-end">
        <button
          className="group flex items-center gap-2"
          onClick={handleDeleteAll}
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
        {data.length < 1 && (
          <h3 className="font-bricolage self-center text-sm font-medium">
            All caught up
          </h3>
        )}

        <AnimatePresence>
          {data.length > 0 &&
            data.map((notification: NotificationProps, index) => (
              <motion.div
                key={notification.id}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex w-full flex-col gap-2"
              >
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
                    <h3 className="font-bricolage text-[12px] font-bold sm:text-sm">
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
                    onClick={() => handleDeleteSingle(String(notification.id))}
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
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NotificationCard;
