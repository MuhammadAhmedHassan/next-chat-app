import prisma from '@app/libs/prisma.db'
import { getSession } from 'next-auth/react'

export const getUsers = async () => {
  const session = await getSession()

  if (!session?.user?.email) return []
  const { email } = session.user
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      where: { NOT: { email } },
    })
    return users
  } catch (error: any) {
    return []
  }
}
