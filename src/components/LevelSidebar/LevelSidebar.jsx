import clsx from 'clsx';
import { REWARDS, SAFE_LEVEL } from '../../data/questions';
import './LevelSidebar.css';

function formatReward(amount) {
  return amount.toLocaleString('hr-HR') + ' €';
}

function LevelSidebar({ currentLevel }) {
  return (
    <div className="level-sidebar">
      {[...REWARDS].reverse().map((reward, i) => {
        const level = REWARDS.length - 1 - i;
        return (
          <div
            key={level}
            className={clsx('level-item', {
              'level-item--active': level === currentLevel,
              'level-item--safe': level === SAFE_LEVEL,
              'level-item--completed': level < currentLevel,
            })}
          >
            <span className="level-item__number">{level + 1}.</span>
            <span className="level-item__reward">{formatReward(reward)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default LevelSidebar;
