"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAssets } from '@/hooks/useAssets';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { Asset, Category, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function AssetsContent() {
  const { assets, loading, error, createAsset, updateAsset, deleteAsset } = useAssets();
  const { categories: allCategories, loading: categoriesLoading } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    purchase_date: '',
    purchase_price: '',
    current_value: '',
    depreciation_rate: '',
    location: '',
    serial_number: '',
    status: 'active' as 'active' | 'inactive' | 'sold' | 'depreciated',
    image_url: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert numbers before submitting and add user_id for new assets
      const assetData = {
        ...formData,
        user_id: 'user-123', // Adding required user_id for mock data
        purchase_price: parseFloat(formData.purchase_price),
        current_value: parseFloat(formData.current_value),
        depreciation_rate: formData.depreciation_rate ? parseFloat(formData.depreciation_rate) : 0
      };
      
      if (editingAsset) {
        // For updates, we don't pass user_id since it's already part of the asset
        const assetUpdateData = {
          ...formData,
          purchase_price: parseFloat(formData.purchase_price),
          current_value: parseFloat(formData.current_value),
          depreciation_rate: formData.depreciation_rate ? parseFloat(formData.depreciation_rate) : 0
        };
        await updateAsset(editingAsset.id, assetUpdateData);
        toast.success('Aset berhasil diperbarui');
      } else {
        await createAsset(assetData);
        toast.success('Aset berhasil ditambahkan');
      }
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        category_id: '',
        purchase_date: '',
        purchase_price: '',
        current_value: '',
        depreciation_rate: '',
        location: '',
        serial_number: '',
        status: 'active',
        image_url: ''
      });
      setEditingAsset(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan aset: ' + appError.message);
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      description: asset.description || '',
      category_id: asset.category_id || '',
      purchase_date: asset.purchase_date,
      purchase_price: asset.purchase_price.toString(),
      current_value: asset.current_value.toString(),
      depreciation_rate: asset.depreciation_rate ? asset.depreciation_rate.toString() : '',
      location: asset.location || '',
      serial_number: asset.serial_number || '',
      status: asset.status,
      image_url: asset.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
      try {
        await deleteAsset(id);
        toast.success('Aset berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus aset: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingAsset(null);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      purchase_date: '',
      purchase_price: '',
      current_value: '',
      depreciation_rate: '',
      location: '',
      serial_number: '',
      status: 'active',
      image_url: ''
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  // Filter categories to only show asset categories
  const assetCategories = allCategories.filter((cat: Category) => cat.type === 'asset');
  const combinedLoading = loading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Aset</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={combinedLoading}>Tambah Aset</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Edit Aset' : 'Tambah Aset Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Aset</Label>
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
                      {assetCategories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
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
                  <Label htmlFor="purchase_date">Tanggal Pembelian</Label>
                  <Input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Harga Pembelian (Rp)</Label>
                  <Input
                    id="purchase_price"
                    name="purchase_price"
                    type="number"
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_value">Nilai Saat Ini (Rp)</Label>
                  <Input
                    id="current_value"
                    name="current_value"
                    type="number"
                    value={formData.current_value}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="depreciation_rate">Tingkat Depresiasi (0-1)</Label>
                  <Input
                    id="depreciation_rate"
                    name="depreciation_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.depreciation_rate}
                    onChange={handleInputChange}
                    placeholder="Contoh: 0.2 untuk 20%"
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={combinedLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serial_number">Nomor Seri</Label>
                  <Input
                    id="serial_number"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive' | 'sold' | 'depreciated')}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="sold">Dijual</SelectItem>
                      <SelectItem value="depreciated">Sudah Depresiasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL Gambar</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="URL gambar aset"
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={combinedLoading}>
                {combinedLoading ? 'Menyimpan...' : (editingAsset ? 'Update Aset' : 'Simpan Aset')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aset</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedLoading ? (
            <TableSkeleton />
          ) : assets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada aset. Tambahkan aset pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga Beli</TableHead>
                  <TableHead>Nilai Kini</TableHead>
                  <TableHead>Depresiasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset: Asset) => {
                  const category = allCategories.find((cat: Category) => cat.id === asset.category_id);
                  
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {asset.image_url && (
                            <div className="w-8 h-8 rounded mr-2 object-cover overflow-hidden">
                              <Image 
                                src={asset.image_url} 
                                alt={asset.name} 
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          {asset.name}
                        </div>
                      </TableCell>
                      <TableCell>{category?.name || 'Kategori tidak ditemukan'}</TableCell>
                      <TableCell>Rp {asset.purchase_price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>Rp {asset.current_value.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        {asset.depreciation_rate ? (asset.depreciation_rate * 100).toFixed(1) + '%' : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          asset.status === 'active' ? 'bg-green-100 text-green-800' :
                          asset.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          asset.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {asset.status === 'active' ? 'Aktif' :
                           asset.status === 'inactive' ? 'Tidak Aktif' :
                           asset.status === 'sold' ? 'Dijual' : 'Sudah Depresiasi'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(asset)}
                            disabled={combinedLoading}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(asset.id)}
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