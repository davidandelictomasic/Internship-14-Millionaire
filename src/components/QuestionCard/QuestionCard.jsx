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
}) {
  function handleClick(index) {
    if (!showingResult) {
      onSelectAnswer(index);
    }
  }

  return (
    <div>
      <p>Pitanje {currentLevel + 1} — {reward}</p>
      <h2>{question}</h2>
      <div>
        {answers.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={showingResult}
          >
            {LABELS[i]}: {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
