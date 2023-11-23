import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
    try {
        // Get the current user
        const currentUser = await getCurrentUser();

        // Get the body of the request
        const body = await request.json();

        // Get the data from the body
        const { userId, isGroup, members, name } = body;

        // If the user is not logged in, return a 401 Unauthorized response
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Check if it is a group conversation, if so, check if the data has been sent correctly (members, name). If not, return a 400 Bad Request response
        if (isGroup && (!members || !name || members.length <= 1)) {
            return new NextResponse('Bad request, invalid data', {
                status: 400,
            });
        }

        if (isGroup) {
            // Create a new group conversation
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),

                            // Why separate the current user from the rest of the members? Because the current user is the one who creates the conversation, so he is the one who starts it, and the rest of the members are the ones who join it
                            {
                                id: currentUser.id,
                            },
                        ],
                    },
                },

                include: {
                    users: true,
                },
            });

            // Return the new conversation
            return NextResponse.json(newConversation);
        }

        // Check if the conversation already exists
        const existingConversation = await prisma.conversation.findMany({
            where: {
                OR: [
                    // Check if the conversation already exists between the current user and the user with the id sent in the request. Why OR? Because the conversation can be started by the current user or by the other user
                    {
                        userIds: {
                            equals: [currentUser.id, userId],
                        },
                    },

                    {
                        userIds: {
                            equals: [userId, currentUser.id],
                        },
                    },
                ],
            },
        });

        // If the conversation already exists, return the first conversation found (there should only be one)
        const singleConversation = existingConversation[0];

        if (singleConversation) {
            // Return the existing conversation
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },

            include: {
                users: true,
            },
        });

        return NextResponse.json(newConversation);
    } catch (error: any) {
        return new NextResponse('Internal error', { status: 500 });
    }
}
