'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import React from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { HiPhoto } from 'react-icons/hi2';

const Form = () => {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        axios.post('/api/messages', {
            ...data,
            conversationId,
        });
    };

    return (
        <div
            className='
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
            '
        >
            <HiPhoto
                className='text-sky-500'
                size={30}
            />

            <form
                className='
                    flex
                    items-center
                    gap-2
                    lg:gap-4
                    w-full
                '
                onSubmit={handleSubmit(onSubmit)}
            >
                Message input
            </form>
        </div>
    );
};

export default Form;
