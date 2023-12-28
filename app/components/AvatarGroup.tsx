"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  // Take the first 3 users from the array
  const usersToShow = users.slice(0, 3);

  // Make a map of the position
  const positions = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {usersToShow.map((user, index) => {
        return (
          <div
            key={user.id}
            className={`
              absolute
              inline-block
              rounded-full
              overflow-hidden
              h-[21px]  
              w-[21px]  
              ${positions[index as keyof typeof positions]}
            `}
          >
            <Image
              alt="Group avatar"
              fill
              src={user?.image || "/images/placeholder.jpg"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AvatarGroup;
