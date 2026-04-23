'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { usePerfumes } from '@/context/PerfumeContext';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { File } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { getPerfumeById, updateStock } = usePerfumes();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/');
    }
  }, [cartItems, router]);

  const detailedCartItems = cartItems.map(item => {
    const perfume = getPerfumeById(item.id);
    return perfume ? { ...item, perfume } : null;
  }).filter(Boolean);

  const subtotal = detailedCartItems.reduce((total, item) => {
    if (!item) return total;
    return total + item.perfume.price * item.quantity;
  }, 0);

  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate stock update
    detailedCartItems.forEach(item => {
      if(item) {
        updateStock(item.id, item.quantity);
      }
    });

    toast({
      title: '¡Pedido Realizado!',
      description: 'Gracias por tu compra. Tu pedido está siendo procesado.',
    });
    clearCart();
    router.push('/');
  };
  
  if (cartItems.length === 0) {
    return null; 
  }

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <h1 className="mb-8 text-center font-headline text-4xl">Finalizar Compra</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" placeholder="Tu Nombre" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="123 Calle del Perfume" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" placeholder="Ciudad Aroma" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input id="zip" placeholder="12345" required />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="yape" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="yape">Yape</TabsTrigger>
                  <TabsTrigger value="plin">Plin</TabsTrigger>
                </TabsList>
                <TabsContent value="yape">
                  <div className="mt-4 flex flex-col items-center gap-4 text-center">
                    <p>Escanea el código QR para pagar:</p>
                    <Image
                      src="https://picsum.photos/seed/yape-qr/200/200"
                      alt="Código QR de Yape"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                    <p className="font-semibold">o paga al número: <span className="text-primary">987 654 321</span></p>
                  </div>
                </TabsContent>
                <TabsContent value="plin">
                  <div className="mt-4 flex flex-col items-center gap-4 text-center">
                    <p>Escanea el código QR para pagar:</p>
                    <Image
                      src="https://picsum.photos/seed/plin-qr/200/200"
                      alt="Código QR de Plin"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                    <p className="font-semibold">o paga al número: <span className="text-primary">912 345 678</span></p>
                  </div>
                </TabsContent>
              </Tabs>
              <Separator className="my-6" />
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="receipt" className="flex items-center gap-2 font-semibold">
                  <File className="h-4 w-4" />
                  Adjuntar Comprobante de Pago
                </Label>
                <Input id="receipt" type="file" required />
                 <Alert className="mt-4">
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    Una vez realizado el pago, por favor adjunta una captura de pantalla o foto del comprobante para verificar tu pedido.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedCartItems.map(item => item && (
                <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image src={item.perfume.imageUrl} alt={item.perfume.name} width={48} height={48} className="rounded-md" />
                        <div>
                            <p className="font-medium">{item.perfume.name}</p>
                            <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                        </div>
                    </div>
                  <span>${(item.perfume.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full">
            Realizar Pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
