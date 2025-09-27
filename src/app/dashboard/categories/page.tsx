import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import CategoriesContent from '@/components/categories/categories-content'

export default async function CategoriesPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Kategori</h1>
      <CategoriesContent />
    </div>
  )
}