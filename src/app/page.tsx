"use client";

import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 relative px-4">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <SignedOut>
              <Link href="/sign-in">
                <Button size="sm" className="text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm" className="text-xs sm:text-sm">
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <Image
            src="/codeguide-logo.png"
            alt="CodeGuide Logo"
            width={50}
            height={50}
            className="rounded-xl sm:w-[60px] sm:h-[60px]"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent font-parkinsans">
            Kantong Freelance
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Manajemen keuangan sederhana untuk freelancer dan UMKM Indonesia
        </p>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-8 max-w-5xl">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-4">💼</div>
          <div className="font-bold text-lg sm:text-xl mb-2">Selamat Datang di Kantong Freelance</div>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8">
            Aplikasi manajemen keuangan yang dirancang khusus untuk membantu freelancer dan pemilik usaha mikro mengelola keuangan dengan lebih mudah dan profesional.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Dashboard Keuangan</h3>
            <p className="text-muted-foreground text-sm">
              Pantau kesehatan finansial bisnis Anda secara real-time dengan dashboard yang intuitif
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-3">📄</div>
            <h3 className="font-semibold text-lg mb-2">Manajemen Invoice</h3>
            <p className="text-muted-foreground text-sm">
              Buat dan kirim tagihan profesional dalam hitungan menit, lacak status pembayaran
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-lg mb-2">Pencatatan Pengeluaran</h3>
            <p className="text-muted-foreground text-sm">
              Catat semua pengeluaran bisnis Anda untuk memantau arus kas dan perencanaan keuangan
            </p>
          </div>
        </div>

        <div className="text-center">
          <SignedOut>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Masuk untuk mengakses dashboard keuangan Anda dan mulai mengelola bisnis dengan lebih profesional
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-in">
                <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto">
                  Masuk
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 w-full sm:w-auto">
                  Daftar Akun Baru
                </Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 py-6">
                Buka Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
