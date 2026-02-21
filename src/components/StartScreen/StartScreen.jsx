import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1 className="start-screen__title">Tko želi biti milijunaš?</h1>
      <p className="start-screen__subtitle">Odgovorite na 10 pitanja i osvojite 500.000 €</p>
      <button className="start-screen__btn" onClick={onStart}>
        Pokreni igru
      </button>
    </div>
  );
}

export default StartScreen;
