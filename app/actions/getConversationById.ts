import prisma from '@app/libs/prisma.db'
import { getCurrentUser } from './getCurrentUser'

export const getConversationById = async (conversationId: string) => {
  const currentUser = await getCurrentUser()

  if (!currentUser?.id) return null
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    })
    return conversation
  } catch (error: any) {
    return null
  }
}
