'use client';

import { useRouter } from 'next/navigation';
import { User, Conversation, Message } from '@prisma/client';
import clsx from 'clsx';
import { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import { useSession } from 'next-auth/react';
import { use, useCallback, useMemo } from 'react';

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected,
}) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1];
    }, [data.messages]);

    const userEmail = useMemo(
        () => session.data?.user?.email,
        [session.data?.user?.email]
    );

    const hasSeen = useMemo(() => {
        if (!lastMessage) return false;

        // Using the [] as a fallback in case the seen array is not defined, preventing a crash on the filter() below.
        // The lastMessage.seen is the array of users that have seen the last message.
        const seenArray = lastMessage.seen || [];

        // If userEmail is not defined, we can't know if the user has seen the message and we can't compare it to the seen array
        if (!userEmail) return false;

        // If the user is in the seen array, it means they have seen the message and we can return true
        return seenArray.filter((user) => user.email === userEmail).length > 0;
    }, [lastMessage, userEmail]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage?.body) {
            return lastMessage.body;
        }

        return 'Started your conversation';
    }, [lastMessage]);

    return <div>Conversation Box</div>;
};

export default ConversationBox;
