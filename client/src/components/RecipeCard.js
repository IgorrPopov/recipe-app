import React from 'react';

const RecipeCard = ({ recipe }) => {
  // console.log(recipe);
  const { title, description, _id } = recipe;
  return (
    <a href='/' className='recipe-card'>
      <div className='recipe-card__img'>
        <img src={`/recipes/${_id}/photo`} alt='dish' />
      </div>
      <div className='recipe-card__text-box'>
        <div className='recipe-card__title'>
          <h3>{title}</h3>
        </div>
        <div className='recipe-card__description'>
          <p>{description}</p>
        </div>
        <div className='recipe-card__author'>by Igor Popov</div>
      </div>
    </a>
  );
};

export default RecipeCard;
