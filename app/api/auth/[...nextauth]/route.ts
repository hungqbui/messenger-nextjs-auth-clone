
// Password encryption
import bcrypt from 'bcrypt';

import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismadb';
import { ClientRequest } from 'http';

// authOptions of type AuthOptions, imported from next-auth, which is an object
// Documentation: https://next-auth.js.org/configuration/options#options
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Provider property accept all authentication providers
    providers: [

        // GitHub provider
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),

        // Google provider
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),

        // Basic authentication
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },

            // Compare user inputs to databased credentials
            async authorize(credentials) {
                // If email and password are not provided throw an error
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid Credentials')
                }

                // IF passed the first test continue searching for user
                const user = await prisma.user.findUnique({
                    where: {
                        // Find user by the unique email
                        email: credentials.email
                    }
                });

                // If there isn't a user or user hashedpassword doesn't exist
                // (due to using social registration therefore email may not have a password)
                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                // Compare the submitted password with the hashed password in our db
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                // Throw an error when the passwords doesn't match
                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                // Return the user when passed all validations
                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development', // Turn on debug mode for development
    session: { 
        strategy: 'jwt' // JSON Web Token for authorization
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

// Latest version of NextAuth, using the route handler inside the app folder,
// this is how it is implemented according to the documentation
export { handler as GET, handler as POST }
