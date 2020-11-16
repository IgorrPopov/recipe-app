import React from 'react';

const RecipeCard = () => (
  <a href='/' className='recipe-card'>
    <div className='recipe-card__img'>
      <img src='https://picsum.photos/300/200' alt='dish' />
    </div>
    <div className='recipe-card__text-box'>
      <div className='recipe-card__title'>
        <h3>Borscht</h3>
      </div>
      <div className='recipe-card__description'>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
          similique iure exercitationem distinctio qui?
        </p>
      </div>
      <div className='recipe-card__author'>by Igor Popov</div>
    </div>
  </a>
);

export default RecipeCard;
