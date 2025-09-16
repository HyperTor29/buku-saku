"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wallet,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClerk } from '@clerk/nextjs';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Klien',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    name: 'Invoice',
    href: '/dashboard/invoices',
    icon: FileText,
  },
  {
    name: 'Pengeluaran',
    href: '/dashboard/expenses',
    icon: Wallet,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    // Sign out through Clerk and redirect to sign-in page
    signOut(() => {
      window.location.href = '/'; // Redirect to homepage after sign out
    });
  };

  return (
    <nav className="grid items-start gap-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
          >
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent' : 'transparent'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </span>
          </Link>
        );
      })}
      <Button 
        variant="ghost" 
        className="justify-start px-3 py-2 text-sm font-medium"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Keluar</span>
      </Button>
    </nav>
  );
}