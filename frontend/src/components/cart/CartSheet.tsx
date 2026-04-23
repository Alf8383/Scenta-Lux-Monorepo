'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { usePerfumes } from '@/context/PerfumeContext';
import CartItem from './CartItem';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export default function CartSheet({ children }: { children: React.ReactNode }) {
  const { cartItems } = useCart();
  const { getPerfumeById } = usePerfumes();

  const detailedCartItems = cartItems.map(item => {
    const perfume = getPerfumeById(item.id);
    return perfume ? { ...item, perfume } : null;
  }).filter(Boolean);

  const subtotal = detailedCartItems.reduce((total, item) => {
    if (!item) return total;
    return total + item.perfume.price * item.quantity;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="font-headline">Carrito de Compras</SheetTitle>
        </SheetHeader>
        <Separator />
        {detailedCartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-6">
                {detailedCartItems.map((item) => item && <CartItem key={item.id} item={item} />)}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between text-lg font-medium">
                  <span className="font-headline">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceder al Pago</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
            <SheetTrigger asChild>
                <Button variant="outline">Continuar Comprando</Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
