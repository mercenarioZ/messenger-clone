import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  isLastMessage?: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLastMessage }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    // Remove the sender from the seen list
    .filter((user) => user.email !== data?.sender?.email)
    // Map the seen list to the name of the user
    .map((user) => user.name)
    // Join the list with a comma
    .join(", ");

  // Styles
  // if the message is sent by the current user, align the message to the right
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>

      <div className={body}>
        {/* Sender name and time sent */}
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>

          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        {/* End of sender name and time sent */}

        {/* Message content */}
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />

          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="image"
              src={data.image}
              width={250}
              height={250}
              className="
                object-cover
                cursor-pointer
                hover:scale-110
                transition
                translate
              "
            />
          ) : (
            data.body
          )}
        </div>
        {/* End of message content */}

        {/* Seen list */}
        {isLastMessage && isOwn && seenList.length > 0 && (
          <div className="text-xs text-gray-400 font-light">
            Seen by {seenList}
          </div>
        )}
        {/* End of seen list */}
      </div>
    </div>
  );
};

export default MessageBox;
