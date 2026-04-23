'use client';

import PerfumeCard from '@/components/perfume/PerfumeCard';
import { usePerfumes } from '@/context/PerfumeContext';

export default function CategoriesPage() {
  const { perfumes } = usePerfumes();
  const categories = ['Para Ella', 'Para Él', 'Unisex'];
  const publishedPerfumes = perfumes.filter(p => p.published);

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl">Categorías</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explora nuestra colección por categoría.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => {
          const perfumesInCategory = publishedPerfumes.filter(p => p.category === category);
          return (
            <section key={category}>
              <h2 className="font-headline text-4xl mb-8 border-b pb-4">{category}</h2>
              {perfumesInCategory.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {perfumesInCategory.map((perfume) => (
                    <PerfumeCard key={perfume.id} perfume={perfume} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay perfumes en esta categoría por el momento.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
