import { getCurrentUser } from '@app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@app/libs/prisma.db'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const { userId, isGroup, members, name } = body
    // If we have userId then it is a one-to-one conversation
    // if we have isGroup, members, name then it is a group chat

    if (!currentUser?.id || !currentUser.email)
      return new NextResponse('Unauthorized', { status: 401 })

    if (isGroup && (!members || members.length < 2 || !name))
      return new NextResponse('Invalid data', { status: 400 })

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      })

      // Update all connections with new conversation
      // newConversation.users.forEach((user) => {
      //   if (user.email) {
      //     pusherServer.trigger(user.email, 'conversation:new', newConversation)
      //   }
      // })

      return NextResponse.json(newConversation)
    }

    // single conversation aka one-to-one conversation
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    })

    const singleConversation = existingConversations[0]

    if (singleConversation) return NextResponse.json(singleConversation)

    // If we don't already have a sinlge conversatoin then create it and return
    // the result
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: { users: true },
    })

    return NextResponse.json(newConversation, { status: 201 })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
