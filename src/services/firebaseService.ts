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

export const getScorePercentile = async (score: number) => {
  try {
    const scoresRef = collection(db, 'Scores');
    const scoresSnapshot = await getDocs(scoresRef);
    
    const allScores = scoresSnapshot.docs.map(doc => doc.data().score);
    
    let scoresBelow = 0

    for(let i=0; i<allScores.length; i++){
      if(allScores[i]<score){
        scoresBelow++;
      }
    }
    
    const percentile = (scoresBelow / allScores.length) * 100;
    
    return percentile;
    
  } catch (error) {
    console.error('Error calculating percentile:', error);
    throw new Error(`Failed to calculate percentile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}