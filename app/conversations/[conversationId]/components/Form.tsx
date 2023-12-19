"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import React from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div
      className="
        bg-white
        w-full
        flex
        border-t-[1px]
        sm:px-4
        px-4
        py-4
        gap-2
        lg:gap-4
        items-center
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="o6iuwsu6"
      >
        <HiPhoto
          className="text-sky-500"
          size={30}
        />
      </CldUploadButton>

      <form
        className="
                    flex
                    items-center
                    gap-2
                    lg:gap-4
                    w-full
                "
        onSubmit={handleSubmit(onSubmit)}
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message..."
        />

        <button
          className="
            rounded-full
            py-2
            px-3
            bg-sky-500
            cursor-pointer
            text-white
            hover:bg-sky-400
            transition
          "
        >
          <HiPaperAirplane size={18} />
        </button>
      </form>
    </div>
  );
};

export default Form;
