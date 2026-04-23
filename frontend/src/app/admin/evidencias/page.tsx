'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Status = 'Pendiente' | 'Aprobado' | 'Rechazado';

const mockEvidences = [
  { id: 'EV001', orderId: 'ORD003', user: 'Alex Doe', date: '2024-07-01', imageUrl: 'https://picsum.photos/seed/receipt1/400/600', status: 'Pendiente' as Status },
  { id: 'EV002', orderId: 'ORD004', user: 'Jane Smith', date: '2024-07-02', imageUrl: 'https://picsum.photos/seed/receipt2/400/600', status: 'Pendiente' as Status },
  { id: 'EV003', orderId: 'ORD005', user: 'Carlos R.', date: '2024-07-02', imageUrl: 'https://picsum.photos/seed/receipt3/400/600', status: 'Aprobado' as Status },
];

export default function EvidencesPage() {
  const [evidences, setEvidences] = useState(mockEvidences);
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: Status) => {
    setEvidences(evidences.map(e => (e.id === id ? { ...e, status: newStatus } : e)));
    toast({
      title: `Evidencia ${newStatus.toLowerCase()}`,
      description: `El comprobante de pago ha sido marcado como ${newStatus.toLowerCase()}.`,
    });
  };

  const getStatusVariant = (status: Status) => {
    switch (status) {
      case 'Aprobado': return 'default';
      case 'Rechazado': return 'destructive';
      case 'Pendiente': return 'secondary';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Evidencias de Pago</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Evidencia</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evidences.map((evidence) => (
              <TableRow key={evidence.id}>
                <TableCell className="font-medium">{evidence.id}</TableCell>
                <TableCell>{evidence.orderId}</TableCell>
                <TableCell>{evidence.user}</TableCell>
                <TableCell>{evidence.date}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(evidence.status)}>{evidence.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2">Ver Comprobante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Comprobante de {evidence.user} - {evidence.orderId}</DialogTitle>
                      </DialogHeader>
                      <div className="relative mt-4 h-[500px] w-full">
                        <Image src={evidence.imageUrl} alt={`Comprobante de ${evidence.orderId}`} fill className="object-contain" />
                      </div>
                    </DialogContent>
                  </Dialog>
                  {evidence.status === 'Pendiente' && (
                    <>
                      <Button variant="outline" size="icon" className="mr-2 h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200" onClick={() => handleStatusChange(evidence.id, 'Aprobado')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => handleStatusChange(evidence.id, 'Rechazado')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
