
'use server';

/**
 * @fileOverview Generates style and perfume advice based on gender and occasion.
 *
 * - getStyleAdvice - A function to generate style advice.
 * - StyleAdviceInput - The input type for the getStyleAdvice function.
 * - StyleAdviceOutput - The return type for the getStyleAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { perfumes as initialPerfumes } from '@/lib/data';

const StyleAdviceInputSchema = z.object({
  gender: z.string().describe('El género para el cual se busca la asesoría (hombre o mujer).'),
  occasion: z.string().describe('La ocasión para la cual se busca la asesoría (p. ej., "Traje de Gala", "Deporte").'),
  availablePerfumes: z.array(z.any()).describe('Una lista de los perfumes actualmente disponibles en la tienda.'),
});
export type StyleAdviceInput = z.infer<typeof StyleAdviceInputSchema>;

const StyleAdviceOutputSchema = z.object({
  perfumeType: z.string().describe('El tipo de perfume recomendado (p. ej., "Amaderado Especiado", "Floral Fresco").'),
  recommendation: z.string().describe('Una breve explicación de por qué este tipo de perfume es adecuado para la ocasión.'),
  perfumeIds: z.array(z.string()).describe('Un array de 2 o 3 IDs de perfumes específicos que coinciden con la recomendación.'),
});
export type StyleAdviceOutput = z.infer<typeof StyleAdviceOutputSchema>;

export async function getStyleAdvice(
  input: StyleAdviceInput
): Promise<StyleAdviceOutput> {
  return styleAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleAdvicePrompt',
  input: {
    schema: StyleAdviceInputSchema,
  },
  output: {
    schema: StyleAdviceOutputSchema,
  },
  prompt: `Eres un experto en estilismo y perfumes. Un cliente necesita una recomendación de fragancia.

  **Contexto del Cliente:**
  - Género: {{{gender}}}
  - Ocasión: {{{occasion}}}

  **Tu Tarea:**
  1.  Basado en el género y la ocasión, determina el tipo de familia olfativa más apropiada.
  2.  Escribe una breve recomendación (2-3 frases) explicando por qué ese tipo de fragancia es ideal.
  3.  De la siguiente lista de perfumes disponibles, selecciona 2 o 3 IDs de perfumes que mejor se ajusten a tu recomendación. Asegúrate de que la categoría del perfume ('Para Él', 'Para Ella', 'Unisex') sea compatible con el género del cliente.

  **Lista de Perfumes Disponibles:**
  {{#each availablePerfumes}}
  ID: {{this.id}}, Nombre: {{this.name}}, Notas: {{this.notes}}, Categoría: {{this.category}}
  {{/each}}

  Responde únicamente con el objeto JSON estructurado.
  `,
});

const styleAdviceFlow = ai.defineFlow(
  {
    name: 'styleAdviceFlow',
    inputSchema: StyleAdviceInputSchema,
    outputSchema: StyleAdviceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
