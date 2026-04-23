'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Perfume } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, writeBatch, query, getDoc } from 'firebase/firestore';
import { perfumes as initialPerfumes } from '@/lib/data';

export type PerfumeWithStatus = Perfume & { published: boolean; createdAt: string };

interface PerfumeContextType {
  perfumes: PerfumeWithStatus[];
  addPerfume: (newPerfume: Omit<Perfume, 'id'>) => Promise<void>;
  deletePerfume: (id: string) => Promise<void>;
  togglePublishStatus: (id: string) => Promise<void>;
  updateStock: (id: string, quantitySold: number) => Promise<void>;
  getPerfumeById: (id: string) => PerfumeWithStatus | undefined;
  loading: boolean;
}

const PerfumeContext = createContext<PerfumeContextType | undefined>(undefined);

export const PerfumeProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [perfumes, setPerfumes] = useState<PerfumeWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  const fetchPerfumes = useCallback(async () => {
    setLoading(true);
    try {
      const perfumesCollection = collection(db, 'perfumes');
      const querySnapshot = await getDocs(perfumesCollection);
      
      if (querySnapshot.empty) {
        // Seed the database if it's empty
        const batch = writeBatch(db);
        initialPerfumes.forEach(p => {
          const docRef = doc(collection(db, 'perfumes'));
          batch.set(docRef, { ...p, published: true, createdAt: '2024-01-01' });
        });
        await batch.commit();
        // Refetch after seeding
        const seededSnapshot = await getDocs(perfumesCollection);
        const perfumesList = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PerfumeWithStatus));
        setPerfumes(perfumesList);
         toast({ title: "Base de Datos Inicializada", description: "Se cargaron los perfumes iniciales en Firestore." });
      } else {
        const perfumesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PerfumeWithStatus));
        setPerfumes(perfumesList);
      }
    } catch (error) {
      console.error("Error fetching perfumes from Firestore: ", error);
      toast({ title: 'Error de Carga', description: 'No se pudieron cargar los perfumes desde la base de datos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [db, toast]);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);


  const addPerfume = async (newPerfumeData: Omit<Perfume, 'id'>) => {
    try {
      const perfumeToAdd = {
        ...newPerfumeData,
        published: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const docRef = await addDoc(collection(db, 'perfumes'), perfumeToAdd);
      setPerfumes(prev => [{ ...perfumeToAdd, id: docRef.id }, ...prev]);
      toast({ title: 'Perfume Agregado', description: `${perfumeToAdd.name} ha sido añadido como borrador.` });
    } catch (error) {
       console.error("Error adding perfume: ", error);
       toast({ title: 'Error', description: 'No se pudo agregar el perfume.', variant: 'destructive' });
    }
  };

  const deletePerfume = async (id: string) => {
    try {
        await deleteDoc(doc(db, "perfumes", id));
        setPerfumes(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Perfume Eliminado', description: 'El perfume ha sido eliminado permanentemente.', variant: 'destructive' });
    } catch (error) {
        console.error("Error deleting perfume: ", error);
        toast({ title: 'Error', description: 'No se pudo eliminar el perfume.', variant: 'destructive' });
    }
  };
  
  const togglePublishStatus = async (id: string) => {
    const perfume = perfumes.find(p => p.id === id);
    if (!perfume) return;
    try {
      const newStatus = !perfume.published;
      const perfumeRef = doc(db, 'perfumes', id);
      await updateDoc(perfumeRef, { published: newStatus });
      setPerfumes(perfumes.map(p => (p.id === id ? { ...p, published: newStatus } : p)));
      toast({ title: `Perfume ${newStatus ? 'publicado' : 'despublicado'}`, description: `${perfume.name} ahora está ${newStatus ? 'visible' : 'oculto'} en la tienda.`});
    } catch (error) {
        console.error("Error toggling status: ", error);
        toast({ title: 'Error', description: 'No se pudo cambiar el estado del perfume.', variant: 'destructive' });
    }
  };

  const updateStock = async (id: string, quantitySold: number) => {
     const perfumeRef = doc(db, "perfumes", id);
     try {
        const docSnap = await getDoc(perfumeRef);
        if (docSnap.exists()) {
            const currentStock = docSnap.data().stock;
            const newStock = currentStock - quantitySold;
            await updateDoc(perfumeRef, { stock: newStock > 0 ? newStock : 0 });

            // Update local state
            setPerfumes(prev => 
                prev.map(p => p.id === id ? { ...p, stock: newStock > 0 ? newStock : 0 } : p)
            );
            
            const perfumeName = docSnap.data().name;
            const message = `¡Venta! Se vendió una unidad de ${perfumeName}. Stock restante: ${newStock}`;

            if (newStock < 5 && newStock > 0) {
                toast({
                    title: 'Alerta de Stock Bajo',
                    description: `${perfumeName} tiene solo ${newStock} unidades. ¡Considera reabastecer!`,
                    variant: 'destructive',
                });
            } else if (newStock >= 0) { // Also show toast for when stock reaches 0
                toast({
                    title: 'Nueva Venta',
                    description: message,
                });
            }
        }
     } catch (error) {
        console.error("Error updating stock: ", error);
     }
  };
  
  const getPerfumeById = (id: string) => {
    return perfumes.find(p => p.id === id);
  };

  return (
    <PerfumeContext.Provider value={{ perfumes, addPerfume, deletePerfume, togglePublishStatus, updateStock, getPerfumeById, loading }}>
      {children}
    </PerfumeContext.Provider>
  );
};

export const usePerfumes = () => {
  const context = useContext(PerfumeContext);
  if (context === undefined) {
    throw new Error('usePerfumes must be used within a PerfumeProvider');
  }
  return context;
};
