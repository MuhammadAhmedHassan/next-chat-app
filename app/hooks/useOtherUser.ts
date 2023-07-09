import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { User } from '@prisma/client'
import { FullConversationType } from '@app/types'

type UserOtherUserProps = FullConversationType | { users: User[] }

export default function useOtherUser(conversation: UserOtherUserProps) {
  const session = useSession()
  const user = session?.data?.user
  const currentUserEmail = user?.email
  const otherUser = useMemo(() => {
    const otherUser = conversation.users.find(
      (user) => user.email !== currentUserEmail
    )
    return otherUser
  }, [conversation.users, currentUserEmail])
  return otherUser
}
