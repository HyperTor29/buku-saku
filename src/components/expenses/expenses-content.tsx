"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from 'sonner';
import { Expense, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function ExpensesContent() {
  const { expenses, loading, error, createExpense, updateExpense, deleteExpense } = useExpenses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    expense_date: '',
    receipt_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert amount to number before submitting
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast.success('Pengeluaran berhasil diperbarui');
      } else {
        await createExpense(expenseData);
        toast.success('Pengeluaran berhasil ditambahkan');
      }
      // Reset form and close dialog
      setFormData({
        description: '',
        amount: '',
        category: '',
        expense_date: '',
        receipt_url: ''
      });
      setEditingExpense(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan pengeluaran: ' + appError.message);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category || '',
      expense_date: expense.expense_date,
      receipt_url: expense.receipt_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      try {
        await deleteExpense(id);
        toast.success('Pengeluaran berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus pengeluaran: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      category: '',
      expense_date: '',
      receipt_url: ''
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Pengeluaran</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>Tambah Pengeluaran</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select 
                  name="category" 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transportasi">Transportasi</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Peralatan">Peralatan</SelectItem>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense_date">Tanggal</Label>
                <Input
                  id="expense_date"
                  name="expense_date"
                  type="date"
                  value={formData.expense_date}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : (editingExpense ? 'Update Pengeluaran' : 'Simpan Pengeluaran')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengeluaran Anda</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada pengeluaran. Tambahkan pengeluaran pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense: Expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category || 'Umum'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(expense.expense_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>Rp {parseInt(expense.amount.toString()).toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(expense)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(expense.id)}
                          disabled={loading}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}