import React from 'react';

const BigRecipeCard = ({ recipe }) => {
  const { _id, title } = recipe;
  return (
    <a href='/' className='big-recipe-card'>
      <div className='big-recipe-card__img'>
        <img src={`/recipes/${_id}/photo`} alt='dish' />
      </div>
      <h3 className='big-recipe-card__title'>{title}</h3>
      <p className='big-recipe-card__cta'>Make your breakfast unforgettable</p>
    </a>
  );
};

export default BigRecipeCard;
