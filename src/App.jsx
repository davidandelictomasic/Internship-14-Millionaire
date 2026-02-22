import { useState, useEffect } from 'react';
import { easyQuestions, hardQuestions, REWARDS, SAFE_LEVEL } from './data/questions';
import StartScreen from './components/StartScreen/StartScreen';
import QuestionCard from './components/QuestionCard/QuestionCard';
import LevelSidebar from './components/LevelSidebar/LevelSidebar';
import Jokers from './components/Jokers/Jokers';
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

function loadSavedGame() {
  try {
    const saved = localStorage.getItem('milijunas-save');
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return null;
}

const saved = loadSavedGame();

function App() {
  const [gamePhase, setGamePhase] = useState(saved ? saved.gamePhase : 'start');
  const [questions, setQuestions] = useState(saved ? saved.questions : []);
  const [currentLevel, setCurrentLevel] = useState(saved ? saved.currentLevel : 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showingResult, setShowingResult] = useState(false);
  const [earnings, setEarnings] = useState(saved ? saved.earnings : 0);
  const [jokers, setJokers] = useState(saved ? saved.jokers : { fiftyFifty: true, skip: true, swap: true });
  const [hiddenAnswers, setHiddenAnswers] = useState(saved ? saved.hiddenAnswers : []);

  useEffect(() => {
    if (gamePhase === 'playing') {
      localStorage.setItem('milijunas-save', JSON.stringify({
        gamePhase, questions, currentLevel, earnings, jokers, hiddenAnswers,
      }));
    } else {
      localStorage.removeItem('milijunas-save');
    }
  }, [gamePhase, questions, currentLevel, earnings, jokers, hiddenAnswers]);

  function handleStartGame() {
    setQuestions(buildQuestionSet());
    setCurrentLevel(0);
    setSelectedAnswer(null);
    setShowingResult(false);
    setEarnings(0);
    setJokers({ fiftyFifty: true, skip: true, swap: true });
    setHiddenAnswers([]);
    setGamePhase('playing');
  }

  function handleFiftyFifty() {
    if (!jokers.fiftyFifty || showingResult) return;

    const correct = questions[currentLevel].correct;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== correct);
    const shuffledWrong = shuffleArray(wrongIndices);

    setHiddenAnswers([shuffledWrong[0], shuffledWrong[1]]);
    setJokers((prev) => ({ ...prev, fiftyFifty: false }));
  }

  function handleSkip() {
    if (!jokers.skip || showingResult) return;

    if (currentLevel === 9) {
      setEarnings(REWARDS[9]);
      setGamePhase('win');
    } else {
      setCurrentLevel((prev) => prev + 1);
      setHiddenAnswers([]);
      setSelectedAnswer(null);
    }
    setJokers((prev) => ({ ...prev, skip: false }));
  }

  function handleSwap() {
    if (!jokers.swap || showingResult) return;

    const pool = currentLevel < 5 ? easyQuestions : hardQuestions;
    const usedTexts = questions.map((q) => q.question);
    const available = pool.filter((q) => !usedTexts.includes(q.question));

    if (available.length === 0) return;

    const newQuestion = shuffleQuestion(available[Math.floor(Math.random() * available.length)]);
    const updated = [...questions];
    updated[currentLevel] = newQuestion;

    setQuestions(updated);
    setHiddenAnswers([]);
    setSelectedAnswer(null);
    setJokers((prev) => ({ ...prev, swap: false }));
  }

  function handleQuit() {
    if (showingResult) return;
    const quitEarnings = currentLevel === 0 ? 0 : REWARDS[currentLevel - 1];
    if (window.confirm('Jeste li sigurni da želite odustati? Osvojili biste: ' + formatReward(quitEarnings))) {
      setEarnings(quitEarnings);
      setGamePhase('gameOver');
    }
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
          setHiddenAnswers([]);
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
        <div className="game-layout">
          <div>
            <Jokers
              jokers={jokers}
              onFiftyFifty={handleFiftyFifty}
              onSkip={handleSkip}
              onSwap={handleSwap}
              onQuit={handleQuit}
              disabled={showingResult}
            />
            <QuestionCard
              question={questions[currentLevel].question}
              answers={questions[currentLevel].answers}
              selectedAnswer={selectedAnswer}
              correctAnswer={questions[currentLevel].correct}
              showingResult={showingResult}
              onSelectAnswer={handleSelectAnswer}
              currentLevel={currentLevel}
              reward={formatReward(REWARDS[currentLevel])}
              hiddenAnswers={hiddenAnswers}
            />
          </div>
          <LevelSidebar currentLevel={currentLevel} />
        </div>
      )}

      {(gamePhase === 'gameOver' || gamePhase === 'win') && (
        <div className="game-over">
          <h1 className={'game-over__title ' + (gamePhase === 'win' ? 'game-over__title--win' : 'game-over__title--lose')}>
            {gamePhase === 'win' ? 'Čestitamo!' : 'Igra je završena!'}
          </h1>
          <div className="game-over__earnings">
            {gamePhase === 'win' ? 'Osvojili ste glavnu nagradu!' : 'Osvojili ste:'}
            <span className="game-over__amount">{formatReward(earnings)}</span>
          </div>
          <button className="game-over__btn" onClick={() => setGamePhase('start')}>Igraj ponovo</button>
        </div>
      )}
    </div>
  );
}

export default App;
