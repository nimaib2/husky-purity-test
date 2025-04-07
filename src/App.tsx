import React, { useState } from 'react';
import { uwQuestions } from './data/questions';
import { GraduationCap } from 'lucide-react';

function App() {
  const [score, setScore] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const handleCheck = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  const calculateScore = () => {
    const uncheckedCount = uwQuestions.length - checkedItems.size;
    const calculatedScore = Math.round((uncheckedCount / uwQuestions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCheckedItems(new Set());
    setScore(null);
    setShowResults(false);
    window.scrollTo(0, 0);
  };

  const getScoreMessage = () => {
    if (score === null) return '';
    if (score >= 90) return 'You\'re practically a UW virgin! Time to explore more of campus life!';
    if (score >= 70) return 'You\'re getting there! Still lots of UW experiences to discover.';
    if (score >= 50) return 'You\'re a typical Husky! You\'ve had your fair share of UW experiences.';
    if (score >= 30) return 'You\'re a seasoned Husky! You\'ve really made the most of your time at UW.';
    return 'You\'re a true UW legend! You\'ve done it all!';
  };

  return (
    <div className="min-h-screen bg-uw-purple text-white">
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
                A lower score indicates you've had more UW experiences.
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
            <div className="text-8xl font-bold text-uw-gold mb-8">{score}%</div>
            <p className="text-2xl mb-8">{getScoreMessage()}</p>
            <button
              onClick={resetQuiz}
              className="bg-uw-purple text-white text-xl py-4 px-8 rounded font-bold hover:bg-opacity-90 transition-colors"
            >
              Take the Test Again
            </button>
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