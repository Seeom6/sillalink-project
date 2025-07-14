import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/lib/api/auth';
import './types'; // Import type extensions

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Admin Login', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 NextAuth authorize called with:', {
            email: credentials.email,
            isAdmin: credentials.isAdmin,
            isAdminType: typeof credentials.isAdmin
          });
        }

        try {
          // Handle both string and boolean values for isAdmin (NextAuth can pass either)
          const isAdminValue = credentials.isAdmin as string | boolean | undefined;
          const isAdminLogin = isAdminValue === 'true' || isAdminValue === 'on' || isAdminValue === true;

          const response = isAdminLogin
            ? await authApi.adminLogin({
                email: credentials.email,
                password: credentials.password,
              })
            : await authApi.login({
                email: credentials.email,
                password: credentials.password,
              });

          if (response.success && response.data.user) {
            // Store tokens in localStorage for API client
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', response.data.accessToken);
              localStorage.setItem('refresh-token', response.data.refreshToken);
            }

            return {
              id: response.data.user._id,
              email: response.data.user.email,
              name: `${response.data.user.firstName} ${response.data.user.lastName}`,
              role: response.data.user.role,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};
