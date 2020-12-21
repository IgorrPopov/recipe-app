import React, { useState, useEffect } from 'react';

const RecipePage = props => {
  const [recipe, setRecipe] = useState(props?.location?.state?.recipe || {});
  const { _id, title, category, description, ingredients, owner = {} } = recipe;

  useEffect(() => {
    if (!recipe || JSON.stringify(recipe) === '{}') {
      const url = props?.location?.pathname || '';
      const urlArr = url.split('/');
      const _id = urlArr[urlArr.length - 1];

      const loadRecipe = async () => {
        try {
          const response = await fetch(`/recipes/${_id}`, {
            headers: {
              'Content-Type': 'json/application',
            },
          });

          if (response.status === 200) {
            const recipe = await response.json();
            setRecipe(recipe);
          }
        } catch (e) {}
      };

      loadRecipe();
    }

    console.log(props);
  }, []);

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
