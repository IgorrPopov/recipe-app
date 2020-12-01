import React, { useState } from 'react';
import RecipeForm from './RecipeForm';

const ToggleButton = () => {
  const [isOpen, setIsOpen] = useState(null);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <RecipeForm />
      ) : (
        <button className='button-add' onClick={handleButtonClick}>
          +
        </button>
      )}
    </>
  );
};

export default ToggleButton;
