import prisma from '@app/libs/prisma.db'
import getSession from './getSession'

export const getCurrentUser = async () => {
  try {
    const session = await getSession()
    if (!session?.user?.email) return null
    const { email } = session.user

    const currentUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!currentUser) return null
    return currentUser
  } catch (error: any) {
    return null
  }
}
