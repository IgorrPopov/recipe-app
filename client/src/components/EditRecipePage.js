import React, { useState } from 'react';
import RecipeForm from './RecipeForm';

const EditRecipePage = props => {
  const [recipe] = useState(props?.location?.state?.recipe || {});

  return (
    <div className='container'>
      <RecipeForm recipe={recipe} />
    </div>
  );
};

export default EditRecipePage;
