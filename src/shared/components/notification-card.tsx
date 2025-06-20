import { MockNotifications } from "@/src/constants/constants";
import { formatTimestampToReadable } from "@/src/utils/date";
import Image from "next/image";

const NotificationCard = () => {
  const data = MockNotifications;
  return (
    <section className="notification_card">
      <div className="flex w-full flex-col gap-5">
        {data.map((notification, index) => (
          <div
            key={notification.id}
            className="flex items-center gap-5"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Image
              src={notification.image}
              alt={`notification_image`}
              width={40}
              height={40}
              className="rounded-full"
            />

            <div className="flex flex-col gap-1">
              <h3 className="font-bricolage text-sm font-semibold">
                {notification.content}
              </h3>
              <p className="font-bricolage text-xs text-gray-400">
                {formatTimestampToReadable(notification.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NotificationCard;
