import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import DashboardContent from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Keuangan</h1>
      <DashboardContent />
    </div>
  )
}