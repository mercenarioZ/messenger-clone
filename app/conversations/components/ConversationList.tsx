"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newConversationHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    // Update conversation handler
    const updateConversationHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const deleteConversationHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((item) => item.id !== conversation.id)];
      });

      // Redirect to conversation list if the current conversation is deleted. This effect can be clearly seen when your screen is small or the opponent deletes the conversation.
      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    // Bind the new conversation event
    pusherClient.bind("new-conversation", newConversationHandler);

    // Bind the update conversation event
    pusherClient.bind("update-conversation", updateConversationHandler);

    // Bind the delete conversation event
    pusherClient.bind("delete-conversation", deleteConversationHandler);

    // Unsubscribe when component unmount
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("new-conversation", newConversationHandler);
      pusherClient.unbind("update-conversation", updateConversationHandler);
      pusherClient.unbind("delete-conversation", deleteConversationHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      {/* Add chat modal */}
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="
              text-2xl
              font-semibold
              text-neutral-900
            "
            >
              Messages
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="
              cursor-pointer
              text-neutral-700
              p-2
              bg-gray-100
              rounded-full
              hover:opacity-80
              transition
            "
            >
              {/* Add icon */}
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => {
            return (
              <ConversationBox
                key={item.id}
                data={item}
                selected={item.id === conversationId}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
