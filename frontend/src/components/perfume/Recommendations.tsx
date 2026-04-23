'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getRecommendationsAction } from '@/app/actions/recommendations';
import { usePerfumes } from '@/context/PerfumeContext';
import type { Perfume } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PerfumeCard from './PerfumeCard';
import { useToast } from '@/hooks/use-toast';

export default function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);
  const { toast } = useToast();
  const { perfumes } = usePerfumes();

  const handleGetRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);
    try {
      const recommendedIds = await getRecommendationsAction();
      if (recommendedIds.length === 0) {
        toast({
          title: 'No se encontraron recomendaciones',
          description: 'No pudimos encontrar ninguna nueva recomendación para ti en este momento.',
          variant: 'destructive',
        });
      } else {
        const allPerfumes = perfumes;
        const recommendedPerfumes = allPerfumes.filter(p => recommendedIds.includes(p.id) && p.published);
        setRecommendations(recommendedPerfumes);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron obtener las recomendaciones. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-4xl">Solo Para Ti</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Basado en tu historial de compras, aquí tienes algunos perfumes que creemos que te encantarán.
          </p>
          <Button size="lg" onClick={handleGetRecommendations} disabled={loading} className="mt-6">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Buscando Tu Fragancia...' : 'Obtener Mis Recomendaciones'}
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-12">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {recommendations.map((perfume) => (
                  <CarouselItem key={perfume.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                      <PerfumeCard perfume={perfume} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
