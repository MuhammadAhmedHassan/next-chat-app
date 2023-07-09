import prisma from '@app/libs/prisma.db'
import { getCurrentUser } from './getCurrentUser'

export const getConversations = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser?.id) return []
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: 'desc' },
      // Get all conversations that has our current user id
      // following condition handles both one-to-one and group-conversations
      where: { userIds: { has: currentUser.id } },
      include: {
        users: true,
        messages: {
          include: { sender: true, seen: true },
        },
      },
    })
    return conversations
  } catch (error: any) {
    return []
  }
}
