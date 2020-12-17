import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// import { UserContext } from './UserContext';

const MyRecipeCard = ({
  recipe = {},
  handleDeleteRecipe,
  handleEditButtonClick,
}) => {
  let { _id, title, createdAt, updatedAt } = recipe;
  createdAt = createdAt.split('T')[0].split('-').reverse().join('.');
  updatedAt = updatedAt.split('T')[0].split('-').reverse().join('.');

  return (
    <div className='my-recipe-card'>
      <div className='my-recipe-card__img'>
        <img src={`/recipes/${_id}/photo`} alt='dish' />
      </div>
      <Link
        to={{ pathname: `/recipes/${_id}`, state: { recipe } }}
        className='my-recipe-card__title'
        recipe={recipe}
      >
        <h5>{title}</h5>
      </Link>
      <div className='my-recipe-card__date'>
        Published: {createdAt} <br />
        Last update: {updatedAt}
      </div>
      <div className='my-recipe-card__actions'>
        <button
          className='button button__my-recipe-card'
          onClick={() => handleEditButtonClick(recipe)}
        >
          Edit
        </button>
        <button
          className='button button__my-recipe-card button__my-recipe-card--delete'
          onClick={() => {
            handleDeleteRecipe(_id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyRecipeCard;
