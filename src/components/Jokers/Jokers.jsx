import clsx from 'clsx';
import './Jokers.css';

function Jokers({ jokers, onFiftyFifty, onSkip, disabled }) {
  return (
    <div className="jokers">
      <button
        className={clsx('joker-btn', { 'joker-btn--used': !jokers.fiftyFifty })}
        onClick={onFiftyFifty}
        disabled={!jokers.fiftyFifty || disabled}
      >
        50:50
      </button>
      <button
        className={clsx('joker-btn', { 'joker-btn--used': !jokers.skip })}
        onClick={onSkip}
        disabled={!jokers.skip || disabled}
      >
        Preskoči
      </button>
    </div>
  );
}

export default Jokers;
