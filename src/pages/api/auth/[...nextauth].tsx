import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: {
          // I wish to request additional permission scopes.
          scope: 'public_repo read:user user:email notifications',
          code: process.env.NEXTAUTH_SECRET,
        },
      },
    }),
    // Add other providers here
  ],
  theme: {
    colorScheme: 'dark', // "auto" | "dark" | "light"
    brandColor: '#FFFFFF', // Hex color code
    logo: 'https://res.cloudinary.com/rohitkk432/image/upload/v1660833498/defios_logo_gsg4eo.png', // Absolute URL to image
    buttonText: 'Sign in with Github', // Text to display on the sign in button
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.uid = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken;
      (session as any).user.id = token.uid;
      return session;
    },
  },
});
