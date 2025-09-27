"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { Category, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function CategoriesContent() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense' | 'investment' | 'asset',
    description: '',
    color: '#6366f1',
    icon: '',
    is_active: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (editingCategory) {
        // For updates, we don't pass user_id since it's already part of the category
        await updateCategory(editingCategory.id, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        // Add user_id for new category creation
        const categoryData = {
          ...formData,
          user_id: 'user-123' // Adding required user_id for mock data
        };
        await createCategory(categoryData);
        toast.success('Kategori berhasil ditambahkan');
      }
      // Reset form and close dialog
      setFormData({
        name: '',
        type: 'expense',
        description: '',
        color: '#6366f1',
        icon: '',
        is_active: true
      });
      setEditingCategory(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan kategori: ' + appError.message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || '',
      color: category.color || '#6366f1',
      icon: category.icon || '',
      is_active: category.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await deleteCategory(id);
        toast.success('Kategori berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus kategori: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      description: '',
      color: '#6366f1',
      icon: '',
      is_active: true
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Kategori</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={loading}>Tambah Kategori</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Jenis</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pendapatan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="investment">Investasi</SelectItem>
                    <SelectItem value="asset">Aset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Warna (hex)</Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon/Emoji</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Contoh: 💼, 🏠, 📈"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select 
                  value={formData.is_active.toString()} 
                  onValueChange={(value) => handleBooleanChange('is_active', value === 'true')}
                  disabled={loading}
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
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : (editingCategory ? 'Update Kategori' : 'Simpan Kategori')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada kategori. Tambahkan kategori pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead>Ikon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: Category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.type === 'income' ? 'bg-green-100 text-green-800' :
                        category.type === 'expense' ? 'bg-red-100 text-red-800' :
                        category.type === 'investment' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {category.type === 'income' ? 'Pendapatan' : 
                         category.type === 'expense' ? 'Pengeluaran' :
                         category.type === 'investment' ? 'Investasi' : 'Aset'}
                      </span>
                    </TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300 mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.color}
                      </div>
                    </TableCell>
                    <TableCell>{category.icon || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(category)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(category.id)}
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