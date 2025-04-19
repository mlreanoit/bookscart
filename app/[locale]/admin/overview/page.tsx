import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import OverviewReport from './overview-report'
import { auth } from '@/auth'
export const metadata: Metadata = {
  title: 'Admin Dashboard',
}
const DashboardPage = async () => {
  const session = await auth()
  // ✅ Redirect to home if not admin
  if (session?.user.role !== 'Admin') {
    redirect('/')
  }

  return <OverviewReport />
}

export default DashboardPage
