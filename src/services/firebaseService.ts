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
  DocumentData
} from 'firebase/firestore';
import { auth, db } from '../firebase';

interface ScoreData {
  score: number;
  userId: string;
  timestamp: Date;
}

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
    console.error('Error adding score:', error);
    throw new Error(`Failed to save score: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getUserScores = async (userId: string) => {
  try {
    const q = query(collection(db, 'Scores'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data() as ScoreData
    }));
  } catch (error) {
    console.error('Error fetching user scores:', error);
    throw new Error(`Failed to fetch scores: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 