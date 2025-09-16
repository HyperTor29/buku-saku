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
      <div className="hidden md:block w-64 border-r bg-muted/10">
        <div className="p-6">
          <h2 className="text-xl font-bold">Kantong Freelance</h2>
        </div>
        <div className="px-3 py-2">
          <DashboardNav />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button */}
        <header className="md:hidden border-b p-4 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6">
                <h2 className="text-xl font-bold">Kantong Freelance</h2>
              </div>
              <div className="px-3 py-2">
                <DashboardNav />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Kantong Freelance</h1>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}