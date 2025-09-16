import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import InvoicesContent from '@/components/invoices/invoices-content'

export default async function InvoicesPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Invoice</h1>
      <InvoicesContent />
    </div>
  )
}