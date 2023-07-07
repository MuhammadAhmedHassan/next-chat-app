'use client'

import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

interface AuthContextProps {}

export default function AuthContext({
  children,
}: PropsWithChildren<AuthContextProps>) {
  return <SessionProvider>{children}</SessionProvider>
}
