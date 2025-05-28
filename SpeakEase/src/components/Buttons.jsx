import React, { useState, useEffect } from 'react';

const Buttons = ({ setFilter, filter,onButtonClick}) => {
  const [buttonStates, setButtonStates] = useState({
    assigned: filter === 'assigned',
    done: filter === 'done',
    missing: filter === 'missing',
  });

  useEffect(() => {
    setButtonStates({
      assigned: filter === 'assigned',
      done: filter === 'done',
      missing: filter === 'missing',
    });
  }, [filter]);

  const handleButtonClick = (buttonName) => {
    setFilter(buttonName);
    setButtonStates({
      assigned: buttonName === 'assigned',
      done: buttonName === 'done',
      missing: buttonName === 'missing',
    });
    onButtonClick();

  };

  return (
    <div className='nav-button'>
      <button className={`buttons todo ${buttonStates.assigned ? 'selected' : ''}`} onClick={() => handleButtonClick('assigned')}>
        To - Do
      </button>
      <button className={`buttons done ${buttonStates.done ? 'selected' : ''}`} onClick={() => handleButtonClick('done')}>
        Done
      </button>
      <button className={`buttons missing ${buttonStates.missing ? 'selected' : ''}`} onClick={() => handleButtonClick('missing')}>
        Missing
      </button>
    </div>
  );
};

export default Buttons;