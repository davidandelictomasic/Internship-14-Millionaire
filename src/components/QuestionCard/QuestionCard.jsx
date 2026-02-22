import clsx from 'clsx';
import './QuestionCard.css';

const LABELS = ['A', 'B', 'C', 'D'];

function QuestionCard({
  question,
  answers,
  selectedAnswer,
  correctAnswer,
  showingResult,
  onSelectAnswer,
  currentLevel,
  reward,
  hiddenAnswers = [],
}) {
  function handleClick(index) {
    if (!showingResult) {
      onSelectAnswer(index);
    }
  }

  return (
    <div className="question-card">
      <div className="question-card__level">
        <div className="question-card__level-number">Pitanje {currentLevel + 1}</div>
        <div className="question-card__reward">{reward}</div>
      </div>
      <div className="question-card__text">{question}</div>
      <div className="answers-grid">
        {answers.map((answer, i) => (
          <button
            key={i}
            className={clsx('answer-btn', {
              'answer-btn--correct': showingResult && i === correctAnswer,
              'answer-btn--wrong': showingResult && i === selectedAnswer && i !== correctAnswer,
              'answer-btn--hidden': hiddenAnswers.includes(i),
            })}
            onClick={() => handleClick(i)}
            disabled={showingResult || hiddenAnswers.includes(i)}
          >
            <span className="answer-btn__label">{LABELS[i]}:</span>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
