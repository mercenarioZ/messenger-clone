"use client";

import { FiAlertTriangle } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import Button from "@/app/components/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something went wrong while deleting the conversation. ")
      )
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 justify-center items-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6" />
        </div>

        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold text-gray-900"
          >
            Delete this conversation
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-sm text-gray-700">Are you sure? This action can&apos;t be undone</p>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          disabled={isLoading}
          danger
          onClick={onDelete}
        >
          Delete
        </Button>

        <Button
          disabled={isLoading}
          secondary
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
