import Sidebar from '@app/components/sidebar/Sidebar'
import { PropsWithChildren } from 'react'
import ConversationList from './components/ConversationList'
import { getConversations } from '@app/actions/getConversations'

export default async function ConversationsLayout({
  children,
}: PropsWithChildren) {
  const conversations = await getConversations()
  return (
    <Sidebar>
      <ConversationList initialItems={conversations} />
      <div className="h-full">{children}</div>
    </Sidebar>
  )
}
