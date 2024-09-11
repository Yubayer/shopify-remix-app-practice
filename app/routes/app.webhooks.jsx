import { Outlet } from '@remix-run/react'
import { json } from 'stream/consumers'

export const action = async ({ request }) => {
  return json({ message: 'Hello World' }, { status: 200 })
}

function webhooksLayout() {
  return <Outlet />
}

export default webhooksLayout