import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat, HiUsers } from 'react-icons/hi';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import useConversation from './useConversation';
import { signOut } from 'next-auth/react';

const useRoutes = () => {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const routes = useMemo(() => [
        {
            icon: HiChat,
            href: '/conversations',
            label: 'Chat',
            active: pathname === '/conversations' || !!conversationId
        },

        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: pathname === '/users'
        },

        {
            label: 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle,
        }
    ], [pathname, conversationId]);

    return routes;
}

export default useRoutes;