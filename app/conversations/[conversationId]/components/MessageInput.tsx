'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
    id,
    placeholder,
    type,
    required,
    register,
    errors,
}) => {
    return (
        <div className='relative w-full'>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete={id}
                {...register(id, { required })}
                className='
                    text-black
                    w-full
                    focus:outline-none
                    p-2
                    rounded-full
                    bg-neutral-100
                    font-light
                '
            />
        </div>
    );
};

export default MessageInput;
