import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import ClientsContent from '@/components/clients/clients-content'

export default async function ClientsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Klien</h1>
      <ClientsContent />
    </div>
  )
}