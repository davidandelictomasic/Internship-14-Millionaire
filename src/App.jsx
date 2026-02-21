import { useState } from 'react';
import { easyQuestions, hardQuestions, REWARDS, SAFE_LEVEL } from './data/questions';
import StartScreen from './components/StartScreen/StartScreen';
import QuestionCard from './components/QuestionCard/QuestionCard';
import './App.css';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestion(q) {
  const indices = [0, 1, 2, 3];
  const shuffled = shuffleArray(indices);
  return {
    question: q.question,
    answers: shuffled.map((i) => q.answers[i]),
    correct: shuffled.indexOf(q.correct),
  };
}

function buildQuestionSet() {
  const easy = shuffleArray(easyQuestions).slice(0, 5).map(shuffleQuestion);
  const hard = shuffleArray(hardQuestions).slice(0, 5).map(shuffleQuestion);
  return [...easy, ...hard];
}

function formatReward(amount) {
  return amount.toLocaleString('hr-HR') + ' €';
}

function App() {
  const [gamePhase, setGamePhase] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showingResult, setShowingResult] = useState(false);
  const [earnings, setEarnings] = useState(0);

  function handleStartGame() {
    setQuestions(buildQuestionSet());
    setCurrentLevel(0);
    setSelectedAnswer(null);
    setShowingResult(false);
    setEarnings(0);
    setGamePhase('playing');
  }

  function handleSelectAnswer(index) {
    if (showingResult) return;

    setSelectedAnswer(index);
    setShowingResult(true);

    setTimeout(() => {
      const isCorrect = index === questions[currentLevel].correct;

      if (isCorrect) {
        if (currentLevel === 9) {
          setEarnings(REWARDS[9]);
          setGamePhase('win');
        } else {
          setCurrentLevel((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowingResult(false);
        }
      } else {
        setEarnings(currentLevel > SAFE_LEVEL ? REWARDS[SAFE_LEVEL] : 0);
        setGamePhase('gameOver');
      }
    }, 2000);
  }

  return (
    <div className="game-container">
      {gamePhase === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {gamePhase === 'playing' && questions.length > 0 && (
        <QuestionCard
          question={questions[currentLevel].question}
          answers={questions[currentLevel].answers}
          selectedAnswer={selectedAnswer}
          correctAnswer={questions[currentLevel].correct}
          showingResult={showingResult}
          onSelectAnswer={handleSelectAnswer}
          currentLevel={currentLevel}
          reward={formatReward(REWARDS[currentLevel])}
        />
      )}

      {(gamePhase === 'gameOver' || gamePhase === 'win') && (
        <div>
          <h1>{gamePhase === 'win' ? 'Čestitamo!' : 'Igra je završena!'}</h1>
          <p>Osvojili ste: {formatReward(earnings)}</p>
          <button onClick={() => setGamePhase('start')}>Igraj ponovo</button>
        </div>
      )}
    </div>
  );
}

export default App;
