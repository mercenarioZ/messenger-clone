"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../Button";
import Modal from "../Modal";
import Input from "../inputs/Input";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <div className="pb-10">
            <h2 className="text-base font-semibold text-gray-800">Profile</h2>

            <p className="mt-1 text-sm text-gray-600">Edit your information</p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                register={register}
                id="name"
                errors={errors}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Photo
                </label>

                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    alt="Avatar"
                    width="45"
                    height="45"
                    className="rounded-full"
                    src={
                      image || currentUser?.image || "/images/placeholder.jpg"
                    }
                  />

                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="o6iuwsu6"
                  >
                    <Button
                      disabled={isLoading}
                      secondary
                    >
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-4">
            <Button
              secondary
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={onClose}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingModal;
