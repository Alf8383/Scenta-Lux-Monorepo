
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

// Mock user data
const user = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  initials: 'AD',
  imageUrl: 'https://picsum.photos/seed/user-avatar/200/200',
};

// Mock order data
const orders = [
  { id: 'ORD001', date: '2024-05-20', total: 220.00, status: 'Entregado' },
  { id: 'ORD002', date: '2024-06-15', total: 180.00, status: 'En Camino' },
  { id: 'ORD003', date: '2024-07-01', total: 395.00, status: 'Procesando' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('scentalux_auth_status') === 'true';
    setIsAuthenticated(loggedIn);
    if (!loggedIn) {
      router.replace('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-center font-headline text-4xl md:text-left">{user.name}</h1>
            <p className="text-center text-lg text-muted-foreground md:text-left">{user.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Ir a Inicio
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Historial de Pedidos</CardTitle>
              <CardDescription>Revisa tus compras recientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detalles de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p>{user.name}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
                <p>{user.email}</p>
              </div>
              <Separator />
              <Button className="w-full">Editar Perfil</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
