import React, { useState } from 'react';

const RecipePage = props => {
  const [recipe] = useState(props?.location?.state?.recipe || {});
  const { _id, title, category, description, ingredients, owner = {} } = recipe;

  let { createdAt = '', updatedAt = '' } = recipe;
  createdAt = createdAt.split('T')[0].split('-').reverse().join('.');
  updatedAt = updatedAt.split('T')[0].split('-').reverse().join('.');

  return (
    <div className='recipe-view__container'>
      <div className='recipe-view'>
        <div className='recipe-view__category'>{category}</div>
        <h4 className='recipe-view__title'>{title}</h4>
        <div className='recipe-view__author'>{owner.name}</div>
        <div className='recipe-view__date'>
          Published: {createdAt} | Last update: {updatedAt}
        </div>
        <div className='recipe-view__photo'>
          <img src={`/recipes/${_id}/photo`} alt='dish' />
        </div>
        <ul className='recipe-view__ingredients'>
          {ingredients &&
            ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
        </ul>
        <div className='recipe-view__description'>
          {description &&
            description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
