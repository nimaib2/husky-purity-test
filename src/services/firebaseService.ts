import { 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const addScore = async (score: number, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'Scores'), {
      score,
      userId,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserScores = async (userId: string) => {
  try {
    const q = query(collection(db, 'Scores'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}; 