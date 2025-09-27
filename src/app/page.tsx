"use client";

import Link from 'next/link';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { Sparkles, Star, Zap, Heart, Gem, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-blue-950/10 relative overflow-hidden">
      {/* Ornamen dekoratif */}
      <div className="absolute top-10 left-10 opacity-30">
        <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-32 right-20 opacity-20">
        <Star className="h-8 w-8 text-pink-400 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      <div className="absolute bottom-40 left-20 opacity-25">
        <Zap className="h-12 w-12 text-blue-400 animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-30">
        <Gem className="h-9 w-9 text-purple-400 animate-bounce" style={{ animationDuration: '5s' }} />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-20">
        <Heart className="h-6 w-6 text-red-400 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>
      <div className="absolute top-1/4 right-1/3 opacity-25">
        <Rocket className="h-7 w-7 text-green-400 animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 relative px-4 z-10">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-2xl blur opacity-75 animate-pulse"></div>
            <Image
              src="/codeguide-logo.png"
              alt="CodeGuide Logo"
              width={50}
              height={50}
              className="relative rounded-xl sm:w-[60px] sm:h-[60px] bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-400 p-1"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-parkinsans relative">
            Kantong Freelance
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Manajemen keuangan sederhana untuk freelancer dan UMKM Indonesia
        </p>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-8 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <div className="text-4xl sm:text-5xl mb-4 relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
            <span className="relative">💼</span>
          </div>
          <div className="font-bold text-lg sm:text-xl mb-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Selamat Datang di Kantong Freelance
          </div>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8">
            Aplikasi manajemen keuangan yang dirancang khusus untuk membantu freelancer dan pemilik usaha mikro mengelola keuangan dengan lebih mudah dan profesional.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 dark:from-yellow-950/20 dark:via-pink-950/20 dark:to-purple-950/20 shadow-lg border border-yellow-200/50 dark:border-yellow-900/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-10 group-hover:animate-spin-slow"></div>
            <div className="text-2xl mb-3 relative z-10">📊</div>
            <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-yellow-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Dashboard Keuangan</h3>
            <p className="text-muted-foreground text-sm relative z-10">
              Pantau kesehatan finansial bisnis Anda secara real-time dengan dashboard yang intuitif
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 shadow-lg border border-cyan-200/50 dark:border-cyan-900/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-10 group-hover:animate-spin-slow"></div>
            <div className="text-2xl mb-3 relative z-10">📄</div>
            <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Manajemen Invoice</h3>
            <p className="text-muted-foreground text-sm relative z-10">
              Buat dan kirim tagihan profesional dalam hitungan menit, lacak status pembayaran
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-green-950/20 dark:via-teal-950/20 dark:to-emerald-950/20 shadow-lg border border-green-200/50 dark:border-green-900/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-10 group-hover:animate-spin-slow"></div>
            <div className="text-2xl mb-3 relative z-10">💰</div>
            <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Pencatatan Pengeluaran</h3>
            <p className="text-muted-foreground text-sm relative z-10">
              Catat semua pengeluaran bisnis Anda untuk memantau arus kas dan perencanaan keuangan
            </p>
          </div>
        </div>

        <div className="text-center relative">
          <SignedOut>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Masuk untuk mengakses dashboard keuangan Anda dan mulai mengelola bisnis dengan lebih profesional
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-xl blur opacity-50 animate-pulse"></div>
                <Link href="/sign-in">
                  <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto relative bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white">
                    Masuk
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-50 animate-pulse"></div>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 w-full sm:w-auto relative border-2 border-purple-500 text-purple-700 dark:text-purple-300 dark:border-purple-400">
                    Daftar Akun Baru
                  </Button>
                </Link>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="relative inline-block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-50 animate-pulse"></div>
              <Link href="/dashboard">
                <Button size="lg" className="text-base px-8 py-6 relative bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  Buka Dashboard
                </Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
