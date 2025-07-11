import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            profile: true,
            provider: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as Role
      }
      return session
    },
    async signIn({ account, profile }) {
      // Allow sign in for existing users
      if (account?.provider === 'credentials') {
        return true
      }

      // For OAuth providers, create user if doesn't exist
      if (account?.provider === 'google' && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })

        if (!existingUser) {
          // Create new user with default PARENT role
          await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || '',
              image: (profile as { picture?: string }).picture,
              role: 'PARENT',
              emailVerified: new Date(),
              profile: {
                create: {
                  firstName: (profile as { given_name?: string }).given_name || '',
                  lastName: (profile as { family_name?: string }).family_name || '',
                  language: 'pt',
                },
              },
            },
          })
        }
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})