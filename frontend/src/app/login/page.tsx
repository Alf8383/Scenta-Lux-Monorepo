'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminEmail = 'admin@example.com';
    const adminPass = '1234';

    let userRole = 'customer';
    if (email === adminEmail && password === adminPass) {
      userRole = 'admin';
    } else if (email === adminEmail && password !== adminPass) {
      toast({
        title: 'Contraseña Incorrecta',
        description: 'La contraseña para la cuenta de administrador no es correcta.',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('scentalux_auth_status', 'true');
    localStorage.setItem('scentalux_user_role', userRole);
    window.dispatchEvent(new Event('storage'));
    
    if (userRole === 'admin') {
      router.push('/admin/estadisticas');
    } else {
      router.push('/');
    }
    router.refresh();
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
              <Button variant="outline" className="w-full" onClick={(e) => {
                  e.preventDefault();
                  // Simulate Google login for a regular customer
                  localStorage.setItem('scentalux_auth_status', 'true');
                  localStorage.setItem('scentalux_user_role', 'customer');
                  window.dispatchEvent(new Event('storage'));
                  router.push('/');
                  router.refresh();
              }}>
                Iniciar Sesión con Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
