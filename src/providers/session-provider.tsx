import React from "react";
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { auth } from '@/../auth'

export async function SessionProvider({
  children
}: React.ComponentProps<typeof NextAuthSessionProvider>) {
  const session = await auth();
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
}