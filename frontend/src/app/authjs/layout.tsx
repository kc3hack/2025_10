import { SessionProvider } from 'next-auth/react';

export default function AuthjsLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
