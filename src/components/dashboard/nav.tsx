"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wallet,
  Tag,
  Briefcase,
  Repeat2,
  Package,
  BarChart3,
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
  {
    name: 'Kategori',
    href: '/dashboard/categories',
    icon: Tag,
  },
  {
    name: 'Proyek',
    href: '/dashboard/projects',
    icon: Briefcase,
  },
  {
    name: 'Transaksi Rutin',
    href: '/dashboard/recurring-transactions',
    icon: Repeat2,
  },
  {
    name: 'Aset',
    href: '/dashboard/assets',
    icon: Package,
  },
  {
    name: 'Laporan',
    href: '/dashboard/reports',
    icon: BarChart3,
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
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-100/30 hover:to-blue-100/30 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20',
                  isActive 
                    ? 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 shadow-sm border border-purple-200/40 dark:border-purple-800/40' 
                    : 'transparent'
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