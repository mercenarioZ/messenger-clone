import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useConversation = () => {
    const params = useParams();

    const conversationId = useMemo(() => {
        if (!params?.conversationId) return '';

        return params.conversationId as string;
    }, [params?.conversationId]);

    // Double bang operator to convert string to boolean
    const isOpen = useMemo(() => !!conversationId, [conversationId]);

    // Return an object with the conversationId and isOpen. Why using useMemo? Because we don't want to recompute the object every time the component re-renders.
    return useMemo(() => ({ conversationId, isOpen }), [conversationId, isOpen]);
}

export default useConversation;