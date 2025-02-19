import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/auth/config';
import { AuthError } from 'next-auth';

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  return (
    <div className='flex flex-col gap-2'>
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            'use server';
            try {
              await signIn(provider.id, {
                redirectTo: callbackUrl ?? '',
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
