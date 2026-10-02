import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { GardenPlan } from '../types/garden';

const COLLECTION_NAME = 'gardens';

export async function saveGardenToFirestore(garden: GardenPlan, userId: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${garden.id}`;
  try {
    const payload = {
      ...garden,
      userId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, garden.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserGardensFromFirestore(userId: string): Promise<GardenPlan[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const results: GardenPlan[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as GardenPlan);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

export async function deleteGardenFromFirestore(gardenId: string, userId: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${gardenId}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, gardenId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserGardens(
  userId: string,
  onUpdate: (gardens: GardenPlan[]) => void,
  onError?: (err: any) => void
) {
  const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const results: GardenPlan[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as GardenPlan);
      });
      onUpdate(results);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );
}
