import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Detailed logging for debugging
        console.log('Authorize called with:', credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            console.log('User not found:', credentials.username);
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.username);
            throw new Error('Invalid password');
          }

          console.log('User authenticated successfully:', user.username);
          
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            username: user.username
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Modify jwt callback to ensure all necessary information is added
    async jwt({ token, user, }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    // Modify session callback to match your middleware expectations
    async session({ session, token }) {
      if (token) {
        // Ensure session.user has all the necessary fields
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          name: token.name as string
        };
      }
      return session;
    }
  },
  // Ensure secret is set
  secret: process.env.NEXTAUTH_SECRET,
  
  // Add pages configuration for custom login
  pages: {
    signIn: '/', // Redirect to home page for login
  }
};

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}