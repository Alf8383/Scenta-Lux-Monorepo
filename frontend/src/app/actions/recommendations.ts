'use server';

import { getPersonalizedRecommendations } from '@/ai/flows/personalized-perfume-recommendations';
import type { PersonalizedRecommendationsInput } from '@/ai/flows/personalized-perfume-recommendations';
import { db } from '@/lib/firebase';
import type { Perfume } from '@/lib/types';
import { collection, getDocs } from 'firebase/firestore';

type StoredPerfume = Partial<Perfume> & { id: string };

export async function getRecommendationsAction(): Promise<string[]> {
  // Mock data for the AI call
  const mockUserId = 'user-123';
  // Simulate a user who likes floral and unisex citrus scents
  // In a real app, these would be fetched for the logged-in user
  const mockPurchaseHistoryIds = ['p001', 'p003']; 

  try {
    const perfumesCollection = collection(db, 'perfumes');
    
    // Fetch all perfumes to create the characteristics map
    const allPerfumesSnapshot = await getDocs(perfumesCollection);
    const allPerfumes = allPerfumesSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as StoredPerfume
    );

    const perfumeCharacteristics = allPerfumes.reduce((acc, perfume) => {
      acc[perfume.id] = {
        name: perfume.name,
        brand: perfume.brand,
        notes: Array.isArray(perfume.notes) ? perfume.notes.join(', ') : perfume.notes,
        type: perfume.category,
      };
      return acc;
    }, {} as Record<string, any>);

    // Filter out perfumes the user has already purchased
    const availableForRecommendation = allPerfumes
      .filter(p => !mockPurchaseHistoryIds.includes(p.id))
      .reduce((acc, perfume) => {
          acc[perfume.id] = perfumeCharacteristics[perfume.id];
          return acc;
      }, {} as Record<string, any>);

    const input: PersonalizedRecommendationsInput = {
      userId: mockUserId,
      purchaseHistory: mockPurchaseHistoryIds.map(id => perfumeCharacteristics[id]?.name || id),
      perfumeCharacteristics: availableForRecommendation,
    };
    
    const result = await getPersonalizedRecommendations(input);
    // Ensure we don't recommend what's already purchased
    return result.recommendations.filter(id => !mockPurchaseHistoryIds.includes(id));
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    // In case of an error, return an empty array to prevent crashes.
    return [];
  }
}
