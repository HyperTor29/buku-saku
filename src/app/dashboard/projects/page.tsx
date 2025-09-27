import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import ProjectsContent from '@/components/projects/projects-content'

export default async function ProjectsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Proyek</h1>
      <ProjectsContent />
    </div>
  )
}