import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/auth/config';
import { AuthError } from 'next-auth';

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className='flex flex-col gap-2'>
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            'use server';
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? '',
              });
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`${process.env.AUTH_URL}?error=${error.type}`);
              }
              throw error;
            }
          }}
        >
          <button type='submit'>
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
