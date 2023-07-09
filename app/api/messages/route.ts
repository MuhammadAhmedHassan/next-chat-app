import { getCurrentUser } from '@app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@app/libs/prisma.db'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const { message, image, conversationId } = await request.json()

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 })

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: currentUser.id } },
        seen: { connect: { id: currentUser.id } },
      },
      include: { seen: true, sender: true },
    })

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: { connect: { id: newMessage.id } },
      },
      include: {
        users: true,
        messages: { include: { seen: true } },
      },
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error: any) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
