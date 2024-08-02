import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                name: { label: 'Name', type: 'text' },
            },
            async authorize(credentials, req) {
                console.log('credentials:', credentials);
                console.log('req:', req.body);
                const user = { name: credentials.name, email: credentials.email };

                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            if (user) {
                console.log('auth.js - user:', user);
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken;
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        }
    }
})
