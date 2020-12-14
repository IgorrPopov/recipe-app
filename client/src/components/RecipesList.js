import React from 'react';
import RecipeCard from './RecipeCard';

const RecipesList = ({ recipes = [] }) => {
  return (
    <div className='section-recipes__list'>
      {recipes.map(recipe => (
        <RecipeCard recipe={recipe} key={recipe._id} />
      ))}
    </div>
  );
};

export default RecipesList;
