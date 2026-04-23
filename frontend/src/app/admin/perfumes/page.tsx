'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { File, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePerfumes } from '@/context/PerfumeContext';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const isRecent = (dateString: string) => {
  const date = new Date(dateString);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return date > sevenDaysAgo;
};

export default function PerfumesAdminPage() {
  const { perfumes, addPerfume, togglePublishStatus, deletePerfume } = usePerfumes();
  const [newPerfume, setNewPerfume] = useState({
    name: '', brand: '', price: '', stock: '', description: '', category: 'Unisex', notes: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPerfume = (e: React.FormEvent) => {
    e.preventDefault();
    const perfumeData = {
      name: newPerfume.name,
      brand: newPerfume.brand,
      price: parseFloat(newPerfume.price),
      stock: parseInt(newPerfume.stock, 10),
      description: newPerfume.description,
      category: newPerfume.category as any,
      notes: newPerfume.notes.split(',').map(n => n.trim()),
      imageUrl: 'https://picsum.photos/seed/new-perfume/600/600',
    };
    addPerfume(perfumeData);
    setNewPerfume({ name: '', brand: '', price: '', stock: '', description: '', category: 'Unisex', notes: '' });
    setIsDialogOpen(false);
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Perfumes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Perfume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <form onSubmit={handleAddPerfume}>
              <DialogHeader>
                <DialogTitle>Nuevo Perfume</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Input id="name" value={newPerfume.name} onChange={e => setNewPerfume({...newPerfume, name: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">Marca</Label>
                  <Input id="brand" value={newPerfume.brand} onChange={e => setNewPerfume({...newPerfume, brand: e.target.value})} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Precio</Label>
                  <Input id="price" type="number" value={newPerfume.price} onChange={e => setNewPerfume({...newPerfume, price: e.target.value})} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">Stock</Label>
                  <Input id="stock" type="number" value={newPerfume.stock} onChange={e => setNewPerfume({...newPerfume, stock: e.target.value})} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Categoría</Label>
                   <Select value={newPerfume.category} onValueChange={v => setNewPerfume({...newPerfume, category: v})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Para Ella">Para Ella</SelectItem>
                      <SelectItem value="Para Él">Para Él</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Descripción</Label>
                  <Textarea id="description" value={newPerfume.description} onChange={e => setNewPerfume({...newPerfume, description: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notas</Label>
                  <Input id="notes" placeholder="bergamota, jazmín, rosa..." value={newPerfume.notes} onChange={e => setNewPerfume({...newPerfume, notes: e.target.value})} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right flex items-center gap-2">
                        <File className="h-4 w-4" />
                        Foto
                    </Label>
                    <Input id="picture" type="file" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Agregar Perfume</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perfumes.map((perfume) => (
              <TableRow key={perfume.id} className={cn(isRecent(perfume.createdAt) && 'bg-blue-50 dark:bg-blue-900/20')}>
                <TableCell className="font-medium">{perfume.name}</TableCell>
                <TableCell>{perfume.brand}</TableCell>
                <TableCell>${perfume.price.toFixed(2)}</TableCell>
                <TableCell>{perfume.createdAt}</TableCell>
                <TableCell>
                  <Badge variant={perfume.published ? 'success' : 'secondary'}>
                    {perfume.published ? 'Publicado' : 'Borrador'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => togglePublishStatus(perfume.id)}>
                    {perfume.published ? 'Despublicar' : 'Publicar'}
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="icon" className="h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el perfume.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePerfume(perfume.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
