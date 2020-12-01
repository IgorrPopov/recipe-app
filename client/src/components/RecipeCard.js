import React from 'react';

const RecipeCard = () => (
  <a href='/' className='recipe-card'>
    <div className='recipe-card__img'>
      <img src='https://source.unsplash.com/300x200?dish' alt='dish' />
    </div>
    <div className='recipe-card__text-box'>
      <div className='recipe-card__title'>
        <h3>Cake Ewa</h3>
      </div>
      <div className='recipe-card__description'>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
          similiq Lorem ipsum dolor, sit amet
        </p>
      </div>
      <div className='recipe-card__author'>by Igor Popov</div>
    </div>
  </a>
);

export default RecipeCard;
