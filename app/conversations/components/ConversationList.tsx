"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

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
