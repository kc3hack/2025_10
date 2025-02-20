import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Serif_JP } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';

import TypekitLoader from '@/loader/TypekitLoader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSerifJP = Noto_Serif_JP({
  variable: '--font-noto-serif-jp',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tankalizer',
  description: 'Tankalizer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <TypekitLoader />
      <SessionProvider>
        <body
          className={`${notoSerifJP.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* 背景画像 */}
          <div className='fixed left-0 top-0 z-[-1] h-lvh w-full opacity-20'>
            <Image src='/bg.jpg' fill alt='Background' className='object-cover'></Image>
          </div>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
