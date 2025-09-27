import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import RecurringTransactionsContent from '@/components/recurring-transactions/recurring-transactions-content'

export default async function RecurringTransactionsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Transaksi Rutin</h1>
      <RecurringTransactionsContent />
    </div>
  )
}