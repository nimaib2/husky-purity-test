import React, { useState, useEffect } from 'react';
import { uwQuestions } from './data/questions';
import { GraduationCap } from 'lucide-react';
import { addScore, findTop3Questions, getScorePercentile, getUserScores } from './services/firebaseService';

function App() {
  const [score, setScore] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreMessage, setScoreMessage] = useState<string>('');
  const [topQuestions, setTopQuestions] = useState<string[]>([]);

  const handleCheck = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  const calculateScore = async () => {
    const uncheckedCount = uwQuestions.length - checkedItems.size;
    const calculatedScore = Math.round((uncheckedCount / uwQuestions.length) * 100);
    const randomUserId = Math.random().toString(36).substring(2, 15);
    setError(null); // Clear any previous errors
    try {
      await addScore(calculatedScore, randomUserId, Array.from(checkedItems));
      setScore(calculatedScore);
      setShowResults(true);
    } catch (error) {
      console.error('Error saving score:', error);
      setError(error instanceof Error ? error.message : 'Failed to save score. Your score will still be displayed.');
      // Still show the score even if saving fails
      setScore(calculatedScore);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCheckedItems(new Set());
    setScore(null);
    setShowResults(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const updateScoreMessage = async () => {
      if (score !== null) {
        const percentile = await getScorePercentile(score);
        if (percentile >= 80) {
          setScoreMessage('You scored higher than ' + percentile.toFixed(2) + '% of Huskies, did you just get here?.\n');
        } else {
          setScoreMessage('You scored higher than ' + percentile + '% of Huskies, you\'re on your way to becoming a seasoned Husky!\n');
        }
      }
    };
    updateScoreMessage();
  }, [score]);

  useEffect(() => {
    const fetchTopQuestions = async () => {
      try {
        const questions = await findTop3Questions(Array.from(checkedItems));
        if (Array.isArray(questions)) {
          setTopQuestions(questions.map(q => q).join('\n').split('\n'));
          console.log('Fetched questions:', questions);
          console.log(questions.length);
        } else {
          console.log(questions);
          setTopQuestions(questions.split('\n'));
          console.log(questions.length);
        }
      } catch (error: any) {
        console.error(error);
        setTopQuestions([error.message]);
      }
    };

    fetchTopQuestions();
  }, [checkedItems]);

  const getScoreMessage = () => {
    return scoreMessage;
  };

  return (
    <div className="min-h-screen bg-uw-purple text-white">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <header className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap size={48} className="text-uw-gold" />
            <h1 className="text-5xl font-bold text-uw-gold">UW Purity Test</h1>
          </div>
          <p className="text-xl">
            Check all the boxes that apply to your UW experience
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-form">
        {!showResults ? (
          <div className="bg-white text-uw-purple rounded p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <p className="text-lg">
                The UW Purity Test measures your University of Washington experience.
                The higher your score, the more "pure" or unexperienced you are in UW culture.
                A lower score indicates you've had more UW experiences. This quiz and its creators are not affiliated
                with the University of Washington. This is a completely anonymous quiz and your
                answers will not be shared with anyone.
              </p>
            </div>

            <div className="space-y-2">
              {uwQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`question-${index}`}
                    checked={checkedItems.has(index)}
                    onChange={() => handleCheck(index)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-uw-purple focus:ring-uw-purple"
                  />
                  <label
                    htmlFor={`question-${index}`}
                    className="cursor-pointer text-lg"
                  >
                    {question}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={calculateScore}
              className="mt-8 w-full bg-uw-purple text-white text-xl py-4 px-8 rounded font-bold hover:bg-opacity-90 transition-colors"
            >
              Calculate My Score
            </button>
          </div>
        ) : (
          <div className="bg-white text-uw-purple rounded p-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Your Score:</h2>
            <div className="text-8xl font-bold text-uw-gold mb-8">{score}</div>
            <p className="text-2xl mb-8">{getScoreMessage()}</p>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Top Questions You Haven't Done:</h3>
              {topQuestions.length > 0 ? (
                <p className="text-lg whitespace-pre-line">
                  {topQuestions.join('\n')}
                </p>
              ) : (
                <p className="text-lg">No questions available.</p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-uw-purple text-white text-xl py-4 px-8 rounded font-bold hover:bg-opacity-90 transition-colors"
              >
                Take the Test Again
              </button>
              <a 
                href="https://forms.gle/9z6AyGJfxZHwq4GM9"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-uw-purple text-white text-xl py-4 px-8 rounded font-bold hover:bg-opacity-90 transition-colors"
              >
                Add/Remove Questions
              </a>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-uw-gold">
        <div className="container mx-auto px-4">
          <p>© 2024 UW Purity Test - Inspired by the Rice Purity Test</p>
        </div>
      </footer>
    </div>
  );
}

export default App;