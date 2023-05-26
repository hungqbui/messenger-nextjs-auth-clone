import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function POST(
    request: Request
) {

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
    let user;
    try {
        user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                hashedPassword: hashedPassword
            }
        })
    } catch (error) {
        return new NextResponse("Email already exists", { status: 404 })
    }
    // Response with the user json and post it to the database
    return NextResponse.json(user);



}