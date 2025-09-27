"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, FileText, Sparkles, Star, Gem, Rocket } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default function DashboardContent() {
  const { financialData, loading, error } = useFinancialData();

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {/* Ornaments for the dashboard */}
      <div className="absolute -top-4 -left-4 opacity-30">
        <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute -top-2 -right-6 opacity-30">
        <Star className="h-6 w-6 text-pink-400 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      <div className="absolute bottom-1/4 -left-6 opacity-30">
        <Gem className="h-7 w-7 text-purple-400 animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute bottom-1/3 -right-3 opacity-30">
        <Rocket className="h-6 w-6 text-blue-400 animate-bounce" style={{ animationDuration: '5s' }} />
      </div>

      {/* Total Income Card */}
      <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-amber-950/20 border-2 border-yellow-200/50 dark:border-yellow-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500"></div>
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-5 group-hover:animate-spin-slow"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Total Pemasukan</CardTitle>
          <div className="relative z-10">
            {loading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <DollarSign className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <LoadingSkeleton className="h-6 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 relative z-10">Rp {financialData.totalIncome.toLocaleString('id-ID')}</div>
              <p className="text-xs text-yellow-500/80 dark:text-yellow-400 relative z-10">+20.1% dari bulan lalu</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Unpaid Invoices Card */}
      <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950/20 dark:via-rose-950/20 dark:to-purple-950/20 border-2 border-pink-200/50 dark:border-pink-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500"></div>
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-5 group-hover:animate-spin-slow"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">Tagihan Belum Dibayar</CardTitle>
          <div className="relative z-10">
            {loading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <FileText className="h-5 w-5 text-pink-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <LoadingSkeleton className="h-6 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-pink-700 dark:text-pink-300 relative z-10">Rp {financialData.totalUnpaidInvoices.toLocaleString('id-ID')}</div>
              <p className="text-xs text-pink-500/80 dark:text-pink-400 relative z-10">+180.1% dari bulan lalu</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-teal-950/20 border-2 border-cyan-200/50 dark:border-cyan-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-500"></div>
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full opacity-5 group-hover:animate-spin-slow"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Total Pengeluaran</CardTitle>
          <div className="relative z-10">
            {loading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <TrendingDown className="h-5 w-5 text-cyan-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <LoadingSkeleton className="h-6 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 relative z-10">Rp {financialData.totalExpenses.toLocaleString('id-ID')}</div>
              <p className="text-xs text-cyan-500/80 dark:text-cyan-400 relative z-10">-19% dari bulan lalu</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Net Profit Card */}
      <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-lime-950/20 border-2 border-green-200/50 dark:border-green-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500"></div>
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-green-400 to-lime-500 rounded-full opacity-5 group-hover:animate-spin-slow"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Laba Bersih</CardTitle>
          <div className="relative z-10">
            {loading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <TrendingUp className="h-5 w-5 text-green-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <LoadingSkeleton className="h-6 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 relative z-10">Rp {financialData.netProfit.toLocaleString('id-ID')}</div>
              <p className="text-xs text-green-500/80 dark:text-green-400 relative z-10">+201% dari bulan lalu</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}