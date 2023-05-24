import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request
) {
    try {
        // Get user inputs from axious post request
        const body = await request.json();
        const {
            email,
            name,
            password
        } = body;

        // Check for missing fields
        if (!email || !name || !password) {
            return new NextResponse("Missing info", { status: 404 });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user follwing the schema
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                hashedPassword: hashedPassword
            }
        })

        // Response with the user json and post it to the database
        return NextResponse.json(user);

    } catch (error : any) {

        // Catch any internal error for debugging
        console.log(error, "REGISTRATION");
        return new NextResponse('Internal Error', { status: 500 });
    }



}