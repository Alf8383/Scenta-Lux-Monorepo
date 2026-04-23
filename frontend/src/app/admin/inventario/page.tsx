'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, AlertTriangle } from 'lucide-react';
import { usePerfumes } from '@/context/PerfumeContext';

export default function InventoryPage() {
  const { perfumes: inventory } = usePerfumes();
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventario de Perfumes</h2>
      </div>

       <Alert>
        <Bell className="h-4 w-4" />
        <AlertTitle>Notificaciones de Stock en Tiempo Real</AlertTitle>
        <AlertDescription>
          El stock se actualiza y las notificaciones se generan cuando se completa una compra en la página de checkout.
        </AlertDescription>
      </Alert>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((perfume) => (
              <TableRow key={perfume.id} className={perfume.stock < 5 ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                <TableCell className="font-medium">{perfume.id}</TableCell>
                <TableCell>{perfume.name}</TableCell>
                <TableCell>{perfume.brand}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {perfume.stock < 5 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <span className={perfume.stock < 5 ? 'font-bold text-red-600' : ''}>
                      {perfume.stock}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {inventory.some(p => p.stock < 5) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>¡Alerta de Inventario!</AlertTitle>
          <AlertDescription>
            Algunos productos tienen stock bajo (menos de 5 unidades). Se recomienda reabastecer pronto.
          </AlertDescription>
        </Alert>
       )}
    </div>
  );
}
