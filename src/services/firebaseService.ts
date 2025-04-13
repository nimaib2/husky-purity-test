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
  DocumentData,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

interface ScoreData {
  score: number;
  userId: string;
  timestamp: Date;
  checkedOff: Array<number>;
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const addScore = async (score: number, userId: string, checkedOff: number[]) => {
  try {
    const docRef = await addDoc(collection(db, 'Scores'), {
      score,
      userId,
      timestamp: new Date(),
      checkedOff
    });
    
    // Update statistics for each checked question
    await updateQuestionStatistics(checkedOff);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding score:', error);
    throw new Error(`Failed to save score: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateQuestionStatistics = async (checkedOff: number[]) => {
  try {
    const statsRef = collection(db, 'Statistics');
    const statsDoc = await getDocs(statsRef);
    
    let statsDocRef;
    let currentCounts: { [key: number]: number } = {};
    
    if (statsDoc.empty) {
      // Create new statistics document if it doesn't exist
      const initialStats: { [key: number]: number } = {};
      for (let i = 0; i < 100; i++) { // Assuming 100 questions
        initialStats[i] = 0;
      }
      const newDoc = await addDoc(statsRef, { questionCounts: initialStats });
      statsDocRef = newDoc;
      currentCounts = initialStats;
    } else {
      // Get the first (and only) statistics document
      statsDocRef = statsDoc.docs[0].ref;
      const statsData = statsDoc.docs[0].data();
      currentCounts = statsData.questionCounts || {};
    }
    
    // Update counts for checked questions
    const updatedCounts = { ...currentCounts };
    checkedOff.forEach(questionIndex => {
      updatedCounts[questionIndex] = (updatedCounts[questionIndex] || 0) + 1;
    });
    
    // Update the document
    await updateDoc(statsDocRef, { questionCounts: updatedCounts });
    
  } catch (error) {
    console.error('Error updating statistics:', error);
    throw new Error(`Failed to update statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      if(allScores[i]<=score){
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