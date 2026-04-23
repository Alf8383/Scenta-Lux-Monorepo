'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Perfume } from './types';

/**
 * Esta función es un ejemplo de cómo puedes añadir datos a tu base de datos
 * desde el "backend" (en este caso, una Server Action de Next.js).
 * 
 * NO está conectada a la interfaz de usuario. Es un ejemplo para que veas el patrón.
 * Para ejecutarla, tendrías que importarla en una página o componente y llamarla.
 */
export async function addPerfumeFromBackend(perfumeData: Omit<Perfume, 'id'>) {
  try {
    const perfumeToAdd = {
      ...perfumeData,
      published: false,
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    const docRef = await addDoc(collection(db, 'perfumes'), perfumeToAdd);
    
    console.log('Perfume añadido con ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error al añadir perfume desde el backend:', error);
    return { success: false, error: (error as Error).message };
  }
}

/*
// EJEMPLO DE CÓMO USAR ESTA FUNCIÓN DESDE UN COMPONENTE:
// 1. Importa la función:
//    import { addPerfumeFromBackend } from '@/lib/seed';

// 2. Llama a la función (por ejemplo, dentro de un botón de prueba):
//
//    <Button onClick={async () => {
//      const nuevoPerfume = {
//        name: 'Perfume de Prueba desde Backend',
//        brand: 'Marca de Prueba',
//        price: 99,
//        stock: 50,
//        imageUrl: 'https://picsum.photos/seed/backend-test/600/600',
//        description: 'Una descripción de prueba.',
//        category: 'Unisex' as const,
//        notes: ['nota1', 'nota2', 'nota3'],
//      };
//      await addPerfumeFromBackend(nuevoPerfume);
//      alert('Perfume de prueba añadido. Revisa tu panel de admin.');
//    }}>
//      Añadir Perfume de Prueba
//    </Button>
*/
