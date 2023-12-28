"use client";

import { useRouter } from "next/navigation";
import { User, Conversation, Message } from "@prisma/client";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import { use, useCallback, useMemo } from "react";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  // useOtherUser is a custom hook that returns the other user in the conversation
  const otherUser = useOtherUser(data);
  // useSession is a hook from next-auth that returns the current session data (user, token, etc)
  const session = useSession();
  // useRouter is a hook from next/router that returns the router object (push, replace, etc)
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  // useMemo is a hook that returns a value that is only recalculated when the dependencies change (in this case, the data.messages)
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  // hasSeen is a boolean that returns true if the user has seen the last message in the conversation
  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    // Using the [] as a fallback in case the seen array is not defined, preventing a crash on the filter() below.
    // The lastMessage.seen is the array of users that have seen the last message.
    const seenArray = lastMessage.seen || [];

    // If userEmail is not defined, we can't know if the user has seen the message and we can't compare it to the seen array
    if (!userEmail) return false;

    // If the user is in the seen array, it means they have seen the message and we can return true
    return seenArray.filter((user) => user.email === userEmail).length > 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started your conversation";
  }, [lastMessage]);

  return (
    <div
      className={clsx(
        `
          w-full
          relative
          flex
          items-center
          space-x-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
          p-2
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
      onClick={handleClick}
    >
      {/* Check if the conversation is a group or not */}
      {data.isGroup ? <AvatarGroup users={data.users} /> : <Avatar user={otherUser} />}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-1
            "
          >
            <p
              className="
                text-md
                font-medium
                text-gray-900
              "
            >
              {data.name || otherUser.name}
            </p>

            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font0-light
                "
              >
                {format(new Date(lastMessage?.createdAt), "p")}
              </p>
            )}
          </div>

          <p
            className={clsx(
              `
                truncate
                text-sm
              `,
              hasSeen ? "text-gray-400" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
