"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';
import { Project, Client, AppError } from '@/types';
import { TableSkeleton } from '@/components/ui/loading-skeleton';

export default function ProjectsContent() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const { clients: allClients, loading: clientsLoading } = useClients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'active' as 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled'
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
      // Convert budget to number before submitting
      const projectData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      };
      
      if (editingProject) {
        // For updates, we don't pass user_id since it's already part of the project
        await updateProject(editingProject.id, projectData);
        toast.success('Proyek berhasil diperbarui');
      } else {
        // Add user_id for new project creation
        const projectCreationData = {
          ...projectData,
          user_id: 'user-123' // Adding required user_id for mock data
        };
        await createProject(projectCreationData);
        toast.success('Proyek berhasil ditambahkan');
      }
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        client_id: '',
        start_date: '',
        end_date: '',
        budget: '',
        status: 'active'
      });
      setEditingProject(null);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error('Gagal menyimpan proyek: ' + appError.message);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      client_id: project.client_id || '',
      start_date: project.start_date,
      end_date: project.end_date || '',
      budget: project.budget ? project.budget.toString() : '',
      status: project.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        await deleteProject(id);
        toast.success('Proyek berhasil dihapus');
      } catch (error: unknown) {
        const appError = error as AppError;
        toast.error('Gagal menghapus proyek: ' + appError.message);
      }
    }
  };

  const handleOpenDialog = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      client_id: '',
      start_date: '',
      end_date: '',
      budget: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  const combinedLoading = loading || clientsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Proyek</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} disabled={combinedLoading}>Tambah Proyek</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Proyek</Label>
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
                  <Label htmlFor="client_id">Klien</Label>
                  <Select 
                    value={formData.client_id} 
                    onValueChange={(value) => handleSelectChange('client_id', value)}
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
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value as 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled')}
                    disabled={combinedLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Perencanaan</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="on-hold">Ditunda</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="end_date">Tanggal Selesai</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    disabled={combinedLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Anggaran (Rp)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={combinedLoading}
                />
              </div>
              
              <Button type="submit" disabled={combinedLoading}>
                {combinedLoading ? 'Menyimpan...' : (editingProject ? 'Update Proyek' : 'Simpan Proyek')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Proyek</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedLoading ? (
            <TableSkeleton />
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada proyek. Tambahkan proyek pertama Anda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Klien</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Selesai</TableHead>
                  <TableHead>Anggaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      {allClients.find((client: Client) => client.id === project.client_id)?.name || 'Klien tidak ditemukan'}
                    </TableCell>
                    <TableCell>{new Date(project.start_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                    <TableCell>
                      {project.budget ? `Rp ${project.budget.toLocaleString('id-ID')}` : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status === 'planning' ? 'Perencanaan' : 
                         project.status === 'active' ? 'Aktif' :
                         project.status === 'completed' ? 'Selesai' :
                         project.status === 'on-hold' ? 'Ditunda' : 'Dibatalkan'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(project)}
                          disabled={combinedLoading}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(project.id)}
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