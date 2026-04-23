'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { List, Grid, Rows3, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { usePerfumes } from '@/context/PerfumeContext';
import PerfumeCard from '@/components/perfume/PerfumeCard';
import Recommendations from '@/components/perfume/Recommendations';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function Home() {
  const { perfumes, loading } = usePerfumes();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [gridSize, setGridSize] = useState(4);

  const filteredPerfumes = perfumes.filter(perfume => {
    if (!perfume.published) return false;

    const matchesSearch =
      perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perfume.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perfume.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = perfume.price >= priceRange[0] && perfume.price <= priceRange[1];

    return matchesSearch && matchesPrice;
  });

  const gridClasses: { [key: number]: string } = {
    1: 'grid-cols-1',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full text-white">
        <Image
          src="https://picsum.photos/1800/1000"
          alt="Elegante botella de perfume sobre un fondo lujoso"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-5xl md:text-7xl">Scenta Lux</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl font-body">
            Descubre tu fragancia insignia de nuestra colección curada de perfumes de lujo.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-headline">
            <Link href="#perfumes">Explorar Colección</Link>
          </Button>
        </div>
      </section>

      <section id="perfumes" className="w-full py-12 md:py-20">
        <div className="container mx-auto">
          <h2 className="mb-10 text-center font-headline text-4xl">Nuestra Colección</h2>

          <div className="mb-8 grid grid-cols-1 items-start gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Input
                type="search"
                placeholder="Buscar por nombre, marca o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between font-body">
                <span>Precio:</span>
                <span className="font-bold">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={300}
                step={5}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-8 flex items-center justify-end gap-2">
            <span className="text-sm font-medium text-muted-foreground">Vista:</span>
             <TooltipProvider>
              {[
                { size: 1, label: 'Una columna', icon: List },
                { size: 4, label: 'Cuatro columnas', icon: Grid },
                { size: 6, label: 'Seis columnas', icon: Rows3 },
              ].map(({ size, label, icon: Icon }) => (
                <Tooltip key={size}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={gridSize === size ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setGridSize(size)}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          
          {loading ? (
             <div className={cn('grid gap-8', gridClasses[gridSize])}>
              {Array.from({ length: 8 }).map((_, i) => (
                 <Card key={i}>
                    <Skeleton className="h-64 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                       <Skeleton className="h-6 w-1/4" />
                       <Skeleton className="h-10 w-1/2" />
                    </CardFooter>
                 </Card>
              ))}
            </div>
          ) : filteredPerfumes.length > 0 ? (
            <div className={cn('grid gap-8', gridClasses[gridSize])}>
              {filteredPerfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} layout={gridSize === 1 ? 'list' : 'grid'} />
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-16">
                <h3 className="font-headline text-2xl">No se encontraron perfumes</h3>
                <p>Intenta ajustar tu búsqueda o rango de precios.</p>
            </div>
          )}
        </div>
      </section>

      <Recommendations />
    </div>
  );
}
