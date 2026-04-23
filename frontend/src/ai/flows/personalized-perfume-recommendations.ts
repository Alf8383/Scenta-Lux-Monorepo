'use server';

/**
 * @fileOverview Personalized perfume recommendations based on user purchase history.
 *
 * - getPersonalizedRecommendations - A function to generate perfume recommendations for a user.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('El ID del usuario para quien generar recomendaciones.'),
  purchaseHistory: z.array(z.string()).describe('Lista de IDs de perfumes que el usuario ha comprado previamente.'),
  perfumeCharacteristics: z.record(z.string(), z.any()).describe('Un mapa de IDs de perfumes a sus características (p. ej., notas, marca, tipo).'),
});

export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('Un array de IDs de perfumes recomendados para el usuario.'),
});

export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {
    schema: PersonalizedRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedRecommendationsOutputSchema,
  },
  prompt: `Eres un experto en perfumes que recomienda perfumes a los usuarios basándose en su historial de compras y las características de los perfumes.

  Historial de compras del usuario: {{purchaseHistory}}

  Características de los perfumes: {{perfumeCharacteristics}}

  Recomienda perfumes que sean similares al historial de compras del usuario basándote en las características proporcionadas. Solo devuelve los IDs de los perfumes en un array JSON.`,    
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
