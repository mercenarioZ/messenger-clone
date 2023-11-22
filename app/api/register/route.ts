import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });

        return NextResponse.json(user);
        // Why the line above is not required to have a 'new' keyword?
    } catch (error: any) {
        console.log(error, "Register error");
        return new NextResponse("Internal error.", { status: 500 });
    }
}
