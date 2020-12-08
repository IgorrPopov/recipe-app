import React, { useState } from 'react';

const RecipePage = props => {
  const [recipe] = useState(props?.location?.state?.recipe || {});
  const { _id, title, category, description, ingredients, owner = {} } = recipe;

  let { createdAt = '', updatedAt = '' } = recipe;
  createdAt = createdAt.replaceAll('-', '.').split('T')[0];
  updatedAt = updatedAt.replaceAll('-', '.').split('T')[0];

  return (
    <div className='recipe-view__container'>
      <div class='recipe-view'>
        <div class='recipe-view__category'>{category}</div>
        <h4 class='recipe-view__title'>{title}</h4>
        <div class='recipe-view__author'>{owner.name}</div>
        <div class='recipe-view__date'>
          Published: {createdAt} | Last update: {updatedAt}
        </div>
        <div class='recipe-view__photo'>
          <img src={`/recipes/${_id}/photo`} alt='dish' />
        </div>
        <ul class='recipe-view__ingredients'>
          {ingredients.map(ingredient => (
            <li>{ingredient}</li>
          ))}
        </ul>
        <div class='recipe-view__description'>
          {description.split('\n').map(p => (
            <p>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
