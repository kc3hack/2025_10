import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/auth/config';
import { AuthError } from 'next-auth';
import React from 'react';
import Image from 'next/image';

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300'>
      {/* ヘッダ */}
      <div className='fixed top-0 z-40 flex h-12 w-full items-center justify-center bg-white font-kokuryu text-2xl'>
        <div className=''>Tankalizer</div>
      </div>

      {/* 背景画像 */}
      <div className='fixed left-0 top-0 z-[-1] h-screen w-full opacity-20'>
        <Image src='/bg.jpg' layout='fill' objectFit='cover' alt='Background'></Image>
      </div>

      <div className='max-w-md w-full bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-6'>
        <h1 className='text-center text-2xl font-bold text-gray-800 border-b border-gray-300 pb-4'>
          共に歌を詠まん
        </h1>
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              'use server';
              try {
                await signIn(provider.id, {
                  redirectTo: (await props.searchParams)?.callbackUrl ?? '',
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
              className='w-full py-3 bg-amber-500 text-white font-medium rounded-lg shadow-md hover:bg-amber-600 transition duration-300'
            >
              <span>{provider.name} でログイン</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
