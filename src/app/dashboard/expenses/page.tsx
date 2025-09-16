import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import ExpensesContent from '@/components/expenses/expenses-content'

export default async function ExpensesPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pencatatan Pengeluaran</h1>
      <ExpensesContent />
    </div>
  )
}