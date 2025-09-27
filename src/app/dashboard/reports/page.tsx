import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import FinancialReportsContent from '@/components/financial-reports/financial-reports-content'

export default async function FinancialReportsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Laporan Keuangan</h1>
      <FinancialReportsContent />
    </div>
  )
}