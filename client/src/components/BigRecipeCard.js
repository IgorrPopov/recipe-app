import React from 'react';
import { Link } from 'react-router-dom';

const BigRecipeCard = ({ recipe }) => {
  const { _id, title } = recipe;
  return (
    <Link
      to={{ pathname: `/recipes/${_id}`, state: { recipe } }}
      className='big-recipe-card'
    >
      <div className='big-recipe-card__img'>
        <img src={`/recipes/${_id}/photo`} alt='dish' />
      </div>
      <h3 className='big-recipe-card__title'>{title}</h3>
      <p className='big-recipe-card__cta'>Make your breakfast unforgettable</p>
    </Link>
  );
};

export default BigRecipeCard;
