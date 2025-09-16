"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';

export default function DashboardContent() {
  const { financialData, loading, error } = useFinancialData();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Income Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {financialData.totalIncome.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
        </CardContent>
      </Card>

      {/* Unpaid Invoices Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tagihan Belum Dibayar</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {financialData.totalUnpaidInvoices.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">+180.1% dari bulan lalu</p>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {financialData.totalExpenses.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">-19% dari bulan lalu</p>
        </CardContent>
      </Card>

      {/* Net Profit Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {financialData.netProfit.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">+201% dari bulan lalu</p>
        </CardContent>
      </Card>
    </div>
  );
}