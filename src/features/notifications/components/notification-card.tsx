import { formatTimestampToReadable } from "@/src/utils/date";
import Image from "next/image";

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
  return (
    <section className="relative flex min-h-[300px] min-w-[300px] flex-col overflow-hidden rounded-[15px] border border-white/20 bg-white px-2 py-4 opacity-95 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),inset_0_1px_0_0_rgba(255,255,255,0.18)]">
      <div className="relative z-10 flex w-full flex-col gap-5">
        {data.map((notification, index) => (
          <div className="flex w-full flex-col gap-2" key={notification.id}>
            <div
              className="motion-preset-blur-down motion-duration-700 flex items-center gap-5"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 p-2">
                <Image
                  src={notification.image}
                  alt={`notification_image`}
                  width={35}
                  height={30}
                  className="rounded-full object-contain"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-bricolage text-sm font-bold">
                  {notification.content}
                </h3>
                <p className="font-grotesk text-xs text-gray-400">
                  {formatTimestampToReadable(notification.createdAt)}
                </p>
              </div>
            </div>
            <hr className="w-full border-t border-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NotificationCard;
