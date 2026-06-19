import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MetricHierarchy } from '../types';

const COLLECTION_NAME = 'metrics';

function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

export async function saveHierarchyToFirestore(orgId: string, hierarchy: MetricHierarchy[]) {
  try {
    const docRef = doc(db, COLLECTION_NAME, orgId);
    await setDoc(docRef, { hierarchy: removeUndefined(hierarchy) });
  } catch (error) {
    console.error(`Error saving hierarchy for ${orgId}:`, error);
    throw error;
  }
}

export async function fetchHierarchyFromFirestore(orgId: string): Promise<MetricHierarchy[] | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, orgId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().hierarchy as MetricHierarchy[];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching hierarchy for ${orgId}:`, error);
    return null;
  }
}
