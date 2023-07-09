import Sidebar from '@app/components/sidebar/Sidebar'
import { PropsWithChildren } from 'react'

export default async function layout({ children }: PropsWithChildren) {
  return (
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  )
}
