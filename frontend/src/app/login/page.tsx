import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/auth/config';
import { AuthError } from 'next-auth';
import React from 'react';
import Image from 'next/image';

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300'>
      {/* ヘッダ /}
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <div className=''>Tankalizer</div>
      </div>

      {/ 背景画像 */}
      <div className='fixed left-0 top-0 z-[-1] h-screen w-full opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      <div className='w-full max-w-md space-y-6 rounded-xl border border-gray-300 bg-white p-6 shadow-lg'>
        <h1 className='border-b border-gray-300 pb-4 text-center text-2xl font-bold text-gray-800'>
          共に歌を詠まん
        </h1>
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
            <button
              type='submit'
              className='w-full rounded-lg bg-amber-500 py-3 font-medium text-white shadow-md transition duration-300 hover:bg-amber-600'
            >
              <span>{provider.name} でログイン</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
