"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useExpenses } from '@/hooks/useExpenses';
import { useInvoices } from '@/hooks/useInvoices';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// Mock data for the reports
const monthlyData = [
  { month: 'Jan', income: 12000000, expenses: 5000000, profit: 7000000 },
  { month: 'Feb', income: 15000000, expenses: 6000000, profit: 9000000 },
  { month: 'Mar', income: 18000000, expenses: 7000000, profit: 11000000 },
  { month: 'Apr', income: 20000000, expenses: 8000000, profit: 12000000 },
  { month: 'Mei', income: 16000000, expenses: 6500000, profit: 9500000 },
  { month: 'Jun', income: 22000000, expenses: 9000000, profit: 13000000 },
];

const categoryData = [
  { name: 'Makanan', value: 3500000 },
  { name: 'Transportasi', value: 2500000 },
  { name: 'Software', value: 1500000 },
  { name: 'Peralatan', value: 2000000 },
  { name: 'Lainnya', value: 500000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function FinancialReportsContent() {
  const { loading: financialDataLoading } = useFinancialData();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const [reportType, setReportType] = useState('monthly');
  const [timeRange, setTimeRange] = useState('last-6-months');

  // Calculate additional metrics
  const totalIncome = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const unpaidInvoices = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const combinedLoading = financialDataLoading || expensesLoading || invoicesLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={reportType} onValueChange={setReportType} disabled={combinedLoading}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="quarterly">Triwulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={combinedLoading}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih rentang waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Bulan Lalu</SelectItem>
              <SelectItem value="last-3-months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="last-6-months">6 Bulan Terakhir</SelectItem>
              <SelectItem value="last-year">Tahun Lalu</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={combinedLoading}>
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Pendapatan</CardTitle>
            {combinedLoading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <DollarSign className="h-5 w-5 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="space-y-1">
                <LoadingSkeleton className="h-7 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">Rp {totalIncome.toLocaleString('id-ID')}</div>
                <p className="text-xs text-green-500/70 dark:text-green-400">+12.5% dari periode sebelumnya</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-2 border-red-200/50 dark:border-red-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Pengeluaran</CardTitle>
            {combinedLoading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="space-y-1">
                <LoadingSkeleton className="h-7 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">Rp {totalExpenses.toLocaleString('id-ID')}</div>
                <p className="text-xs text-red-500/70 dark:text-red-400">+3.2% dari periode sebelumnya</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Laba Bersih</CardTitle>
            {combinedLoading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <TrendingUp className="h-5 w-5 text-blue-500" />
            )}
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="space-y-1">
                <LoadingSkeleton className="h-7 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">Rp {netProfit.toLocaleString('id-ID')}</div>
                <p className="text-xs text-blue-500/70 dark:text-blue-400">+18.7% dari periode sebelumnya</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200/50 dark:border-orange-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Tagihan Belum Dibayar</CardTitle>
            {combinedLoading ? (
              <LoadingSkeleton className="h-5 w-5 rounded-full" />
            ) : (
              <FileText className="h-5 w-5 text-orange-500" />
            )}
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="space-y-1">
                <LoadingSkeleton className="h-7 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">Rp {unpaidInvoices.toLocaleString('id-ID')}</div>
                <p className="text-xs text-orange-500/70 dark:text-orange-400">3 invoice menunggu pembayaran</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan vs Pengeluaran Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="h-[300px] w-full">
                <LoadingSkeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Pendapatan" fill="#10b981" />
                  <Bar dataKey="expenses" name="Pengeluaran" fill="#ef4444" />
                  <Bar dataKey="profit" name="Laba" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="h-[300px] w-full">
                <LoadingSkeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Financial Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Wawasan Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LoadingSkeleton className="h-24 w-full rounded-lg" />
              <LoadingSkeleton className="h-24 w-full rounded-lg" />
              <LoadingSkeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Rasio Pengeluaran</h3>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {((totalExpenses / totalIncome) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Pengeluaran terhadap pendapatan
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Laba Bulanan Rata-rata</h3>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  Rp {(netProfit / 6).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Berdasarkan 6 bulan terakhir
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Cash Flow</h3>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {netProfit >= 0 ? 'Positif' : 'Negatif'}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Arus kas Anda {netProfit >= 0 ? 'sehat' : 'perlu diperhatikan'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}