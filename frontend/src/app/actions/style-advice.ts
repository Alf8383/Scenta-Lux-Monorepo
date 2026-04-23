
'use server';

import { getStyleAdvice as getStyleAdviceFlow, type StyleAdviceInput } from '@/ai/flows/style-advice';

// The server-side action cannot access the client-side context directly.
// We pass the available perfumes from the client to this action,
// which then passes them to the AI flow.
export async function getStyleAdvice(input: StyleAdviceInput) {
  try {
    const result = await getStyleAdviceFlow(input);
    return result;
  } catch (error) {
    console.error('Error al obtener la asesoría de estilo:', error);
    throw new Error('No se pudo obtener la recomendación.');
  }
}
