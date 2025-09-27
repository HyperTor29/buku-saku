"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';
import { Invoice, Client, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function InvoicesContent() {
  const { invoices, loading, error, createInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const { clients: allClients, loading: clientsLoading } = useClients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    items: [{ item: '', qty: 1, price: 0 }],
    notes: '',
    status: 'draft'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item: '', qty: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.qty * item.price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calculate total amount before submitting
      const total_amount = calculateTotal();
      
      // Ensure status is of correct type
      const invoiceData = {
        ...formData,
        total_amount,
        status: formData.status as 'draft' | 'sent' | 'paid'
      };
      
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
        toast.success('Invoice berhasil diperbarui');
      } else {
        await createInvoice(invoiceData);
        toast.success('Invoice berhasil dibuat');
      }
      // Reset form and close dialog
      setFormData({
        client_id: '',
        invoice_number: '',
        issue_date: '',
        due_date: '',
        items: [{ item: '', qty: 1, price: 0 }],
        notes: '',
        status: 'draft'
      });
      setEditingInvoice(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan invoice: ' + appError.message);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      client_id: invoice.client_id || '',
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      items: invoice.items || [{ item: '', qty: 1, price: 0 }],
      notes: invoice.notes || '',
      status: invoice.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
      try {
        await deleteInvoice(id);
        toast.success('Invoice berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus invoice: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingInvoice(null);
    setFormData({
      client_id: '',
      invoice_number: '',
      issue_date: '',
      due_date: '',
      items: [{ item: '', qty: 1, price: 0 }],
      notes: '',
      status: 'draft'
    });
    setIsDialogOpen(true);
  };

  const updateInvoiceStatus = async (id: string, status: 'draft' | 'sent' | 'paid') => {
    try {
      await updateInvoice(id, { status });
      toast.success('Status invoice berhasil diperbarui');
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal memperbarui status invoice: ' + appError.message);
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  const combinedLoading = loading || clientsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Invoice</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={combinedLoading}>Buat Invoice Baru</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Buat Invoice Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Klien</Label>
                  <Select 
                    name="client_id" 
                    value={formData.client_id} 
                    onValueChange={(value) => setFormData(prev => ({...prev, client_id: value}))}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih klien" />
                    </SelectTrigger>
                    <SelectContent>
                      {allClients.map((client: Client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Nomor Invoice</Label>
                  <Input
                    id="invoice_number"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue_date">Tanggal Issue</Label>
                  <Input
                    id="issue_date"
                    name="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Item Invoice</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Deskripsi item"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                        required
                        disabled={combinedLoading}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                        required
                        disabled={combinedLoading}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Harga"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value) || 0)}
                        required
                        disabled={combinedLoading}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={combinedLoading || formData.items.length <= 1}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addItem}
                  disabled={combinedLoading}
                >
                  Tambah Item
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={combinedLoading}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total: Rp {calculateTotal().toLocaleString('id-ID')}
                </div>
                <Button type="submit" disabled={combinedLoading}>
                  {combinedLoading ? 'Menyimpan...' : (editingInvoice ? 'Update Invoice' : 'Simpan Invoice')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice Anda</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedLoading ? (
            <TableSkeleton />
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada invoice. Buat invoice pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Klien</TableHead>
                  <TableHead>Tanggal Issue</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice: Invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.clients?.name || 'Klien tidak ditemukan'}</TableCell>
                    <TableCell>{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>Rp {invoice.total_amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Lunas' : 
                         invoice.status === 'sent' ? 'Terkirim' : 'Draf'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(invoice)}
                          disabled={combinedLoading}
                        >
                          Edit
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                            disabled={combinedLoading}
                          >
                            Kirim
                          </Button>
                        )}
                        {invoice.status === 'sent' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                            disabled={combinedLoading}
                          >
                            Lunas
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(invoice.id)}
                          disabled={combinedLoading}
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