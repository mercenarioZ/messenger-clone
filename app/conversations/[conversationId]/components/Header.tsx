"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const statusText = React.useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active now";
  }, [conversation]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          bg-white
          w-full
          flex
          border-b-[1px]
          sm:px-4
          py-4
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-sm
        "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
              lg:hidden
              block
              text-sky-500
              hover:text-sky-600
              transition
              cursor-pointer
            "
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}

          <div className="flex flex-col">
            <div>{conversation.name || otherUser?.name || "Unnamed"}</div>

            <div
              className="
                text-sm
                font-light
                text-neutral-500
              "
            >
              {statusText}
            </div>
          </div>
        </div>

        {/* Dot icon */}
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {
            setDrawerOpen(true);
          }}
          className="
              cursor-pointer
              text-neutral-500
              hover:text-neutral-700
              transition
            "
        />
      </div>
    </>
  );
};

export default Header;
