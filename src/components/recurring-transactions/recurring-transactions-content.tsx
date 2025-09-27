"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { RecurringTransaction, Category, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function RecurringTransactionsContent() {
  const { recurringTransactions, loading, error, createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction } = useRecurringTransactions();
  const { categories: allCategories, loading: categoriesLoading } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    category_id: '',
    type: 'expense' as 'income' | 'expense',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom',
    start_date: '',
    end_date: '',
    next_due_date: '',
    is_active: true,
    notify_before_days: '3'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert amount and notify_before_days to numbers before submitting
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        notify_before_days: parseInt(formData.notify_before_days)
      };
      
      if (editingTransaction) {
        // For updates, we don't pass user_id since it's already part of the transaction
        await updateRecurringTransaction(editingTransaction.id, transactionData);
        toast.success('Transaksi rutin berhasil diperbarui');
      } else {
        // Add user_id for new transaction creation
        const transactionCreationData = {
          ...transactionData,
          user_id: 'user-123' // Adding required user_id for mock data
        };
        await createRecurringTransaction(transactionCreationData);
        toast.success('Transaksi rutin berhasil ditambahkan');
      }
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        amount: '',
        category_id: '',
        type: 'expense',
        frequency: 'monthly',
        start_date: '',
        end_date: '',
        next_due_date: '',
        is_active: true,
        notify_before_days: '3'
      });
      setEditingTransaction(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan transaksi rutin: ' + appError.message);
    }
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      description: transaction.description || '',
      amount: transaction.amount.toString(),
      category_id: transaction.category_id || '',
      type: transaction.type,
      frequency: transaction.frequency,
      start_date: transaction.start_date,
      end_date: transaction.end_date || '',
      next_due_date: transaction.next_due_date,
      is_active: transaction.is_active,
      notify_before_days: transaction.notify_before_days ? transaction.notify_before_days.toString() : '3'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi rutin ini?')) {
      try {
        await deleteRecurringTransaction(id);
        toast.success('Transaksi rutin berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus transaksi rutin: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingTransaction(null);
    setFormData({
      name: '',
      description: '',
      amount: '',
      category_id: '',
      type: 'expense',
      frequency: 'monthly',
      start_date: '',
      end_date: '',
      next_due_date: '',
      is_active: true,
      notify_before_days: '3'
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  const combinedLoading = loading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Transaksi Rutin</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={combinedLoading}>Tambah Transaksi Rutin</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'Edit Transaksi Rutin' : 'Tambah Transaksi Rutin Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Transaksi</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange('type', value as 'income' | 'expense')}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Pendapatan</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={combinedLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah (Rp)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => handleSelectChange('category_id', value)}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories
                        .filter((cat: Category) => cat.type === formData.type)
                        .map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frekuensi</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value) => handleSelectChange('frequency', value as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom')}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih frekuensi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="quarterly">Triwulanan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                      <SelectItem value="custom">Kustom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notify_before_days">Pengingat (hari sebelum jatuh tempo)</Label>
                  <Input
                    id="notify_before_days"
                    name="notify_before_days"
                    type="number"
                    value={formData.notify_before_days}
                    onChange={handleInputChange}
                    min="0"
                    max="30"
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Tanggal Mulai</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="next_due_date">Tanggal Jatuh Tempo Berikutnya</Label>
                  <Input
                    id="next_due_date"
                    name="next_due_date"
                    type="date"
                    value={formData.next_due_date}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_date">Tanggal Berakhir (Opsional)</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <Select 
                    value={formData.is_active.toString()} 
                    onValueChange={(value) => handleBooleanChange('is_active', value === 'true')}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" disabled={combinedLoading}>
                {combinedLoading ? 'Menyimpan...' : (editingTransaction ? 'Update Transaksi' : 'Simpan Transaksi')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi Rutin</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedLoading ? (
            <TableSkeleton />
          ) : recurringTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada transaksi rutin. Tambahkan transaksi rutin pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Frekuensi</TableHead>
                  <TableHead>Jatuh Tempo Berikutnya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringTransactions.map((transaction: RecurringTransaction) => {
                  const category = allCategories.find((cat: Category) => cat.id === transaction.category_id);
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                        </span>
                      </TableCell>
                      <TableCell>{category?.name || 'Kategori tidak ditemukan'}</TableCell>
                      <TableCell>Rp {transaction.amount.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        {transaction.frequency === 'daily' ? 'Harian' :
                         transaction.frequency === 'weekly' ? 'Mingguan' :
                         transaction.frequency === 'monthly' ? 'Bulanan' :
                         transaction.frequency === 'quarterly' ? 'Triwulanan' :
                         transaction.frequency === 'yearly' ? 'Tahunan' : 'Kustom'}
                      </TableCell>
                      <TableCell>{new Date(transaction.next_due_date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(transaction)}
                            disabled={combinedLoading}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(transaction.id)}
                            disabled={combinedLoading}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}