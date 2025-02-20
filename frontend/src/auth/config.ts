import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECREAT,
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  events: {
    signIn: async ({ user }) => {
      // console.log('signin: ' + JSON.stringify(user));

      try {
        // 認証成功時、DBにユーザデータを登録
        const res = await fetch(`${process.env.BACKEND_URL}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            icon: user.image,
          }),
        });

        console.log(res);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
