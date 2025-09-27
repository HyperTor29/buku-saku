import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import AssetsContent from '@/components/assets/assets-content'

export default async function AssetsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Aset</h1>
      <AssetsContent />
    </div>
  )
}