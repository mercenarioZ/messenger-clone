import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

/**
 * This asynchronous function is used to get the current user's information.
 *
 * It first attempts to get the current session using the imported `getSession` function.
 * If there is no session or the session does not have a user with an email, it returns null.
 *
 * If a session with a user email is found, it then uses Prisma to query the database for a user with that email.
 * The `prisma.user.findUnique` function is used to ensure that only one user is returned.
 *
 * If an error occurs at any point during this process, the function catches the error and returns null.
 *
 * @returns {Promise<User | null>} The current user's information, or null if no user is found or an error occurs.
 */
const getCurrentUser = async () => {
    try {
        const session = await getSession();
        // console.log('User session: ', session)

        // If there is no session, return null
        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });

        if (!currentUser) {
            return null;
        }
        // Why return null? Why not throw an error? Because this function is used in the `getServerSideProps` function, which is used to get data for the page before it is rendered. If an error is thrown, the page will crash. If null is returned, the page will render without the user's information.

        return currentUser;
    } catch (error: any) {
        return null;
    }
};

export default getCurrentUser;
