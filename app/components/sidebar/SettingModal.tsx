"use client";

import { User } from "@prisma/client";

interface SettingModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingModal: React.FC<SettingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  return <div>Setting modal</div>;
};

export default SettingModal;
