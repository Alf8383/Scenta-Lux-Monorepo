
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { getStyleAdvice } from '@/app/actions/style-advice';
import { usePerfumes } from '@/context/PerfumeContext';

type Gender = 'hombre' | 'mujer';
type Occasion = 'gala' | 'deporte' | 'cita' | 'reunion';
type Advice = {
  perfumeType: string;
  recommendation: string;
  perfumeIds: string[];
};

const occasionMap: Record<Occasion, string> = {
  gala: 'Traje de Gala',
  deporte: 'Deporte',
  cita: 'Cita Romántica',
  reunion: 'Reunión de Negocios',
};

const avatarMap: Record<Gender, Record<Occasion, { url: string }>> = {
  mujer: {
    gala: { url: 'https://picsum.photos/seed/mujer-gala-fashion/600/800' },
    deporte: { url: 'https://picsum.photos/seed/mujer-deporte-fashion/600/800' },
    cita: { url: 'https://picsum.photos/seed/mujer-cita-fashion/600/800' },
    reunion: { url: 'https://picsum.photos/seed/mujer-reunion-fashion/600/800' },
  },
  hombre: {
    gala: { url: 'https://picsum.photos/seed/hombre-gala-fashion/600/800' },
    deporte: { url: 'https://picsum.photos/seed/hombre-deporte-fashion/600/800' },
    cita: { url: 'https://picsum.photos/seed/hombre-cita-fashion/600/800' },
    reunion: { url: 'https://picsum.photos/seed/hombre-reunion-fashion/600/800' },
  },
};

export default function AsesoriaPage() {
  const [gender, setGender] = useState<Gender>('mujer');
  const [occasion, setOccasion] = useState<Occasion>('cita');
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);
  const { perfumes } = usePerfumes();

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    try {
      // Pass the list of available (published) perfumes to the action.
      const availablePerfumes = perfumes.filter(p => p.published).map(p => ({
        id: p.id,
        name: p.name,
        notes: p.notes.join(', '),
        category: p.category
      }));

      const result = await getStyleAdvice({
        gender,
        occasion: occasionMap[occasion],
        availablePerfumes: availablePerfumes,
      });
      setAdvice(result);
    } catch (error) {
      console.error('Error al obtener la asesoría:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoading(false);
    }
  };
  
  const selectedAvatar = avatarMap[gender][occasion];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl">Asesoría de Estilo</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Encuentra el look y la fragancia perfectos para cada ocasión.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna de Avatar */}
        <div className="md:col-span-1 flex flex-col items-center">
          <Card className="w-full sticky top-24">
            <CardHeader>
              <CardTitle className="text-center font-headline">Tu Estilo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image
                  key={selectedAvatar.url}
                  src={selectedAvatar.url}
                  alt={`Avatar para ${gender} en ocasión ${occasion}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna de Opciones y Resultados */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">1. Elige el Género</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={gender}
                onValueChange={(value: Gender) => setGender(value)}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mujer" id="mujer" />
                  <Label htmlFor="mujer" className="text-lg">Mujer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hombre" id="hombre" />
                  <Label htmlFor="hombre" className="text-lg">Hombre</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">2. Elige la Ocasión</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {(Object.keys(occasionMap) as Occasion[]).map((occ) => (
                <Button
                  key={occ}
                  variant={occasion === occ ? 'default' : 'outline'}
                  onClick={() => setOccasion(occ)}
                  size="lg"
                >
                  {occasionMap[occ]}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Button size="lg" onClick={handleGetAdvice} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Obteniendo Asesoría...' : 'Obtener Recomendación de Perfume'}
          </Button>

          {advice && (
            <Card className="animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="font-headline">Recomendación de Fragancia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-bold text-lg text-primary">{advice.perfumeType}</h3>
                <p className="text-foreground/80">{advice.recommendation}</p>
                <p className="text-sm text-muted-foreground">
                  Sugerencias de perfumes: {advice.perfumeIds.join(', ')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
