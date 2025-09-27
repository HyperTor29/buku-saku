"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { DashboardNav } from '@/components/dashboard/nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        // Redirect to sign-in page if user is not authenticated
        router.push('/sign-in');
      } else {
        setIsChecking(false);
      }
    }
  }, [userId, isLoaded, router]);

  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-64 border-r bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="p-6 bg-gradient-to-r from-purple-100/30 to-blue-100/30 dark:from-purple-900/20 dark:to-blue-900/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Kantong Freelance</h2>
        </div>
        <div className="px-3 py-2">
          <DashboardNav />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button */}
        <header className="md:hidden border-b p-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <div className="p-6 bg-gradient-to-r from-purple-100/30 to-blue-100/30 dark:from-purple-900/20 dark:to-blue-900/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Kantong Freelance</h2>
              </div>
              <div className="px-3 py-2">
                <DashboardNav />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Kantong Freelance</h1>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-indigo-50/30 dark:from-purple-950/10 dark:via-blue-950/10 dark:to-indigo-950/10">
          {children}
        </main>
      </div>
    </div>
  );
}