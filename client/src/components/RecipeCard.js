import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const { title, _id, owner } = recipe;
  let { description } = recipe;

  if (description && description.length >= 400) {
    // to fit in a div at the bottom
    description = description.substring(0, 400).trim() + '...';
  }

  return (
    <Link to='/' className='recipe-card'>
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
        <div className='recipe-card__author'>by {owner.name}</div>
      </div>
    </Link>
  );
};

export default RecipeCard;
