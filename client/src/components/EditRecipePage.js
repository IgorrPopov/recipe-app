import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

import RecipeForm from './RecipeForm';

const EditRecipePage = props => {
  const { user } = useContext(UserContext);
  const [recipe] = useState(props?.location?.state?.recipe || {});

  useEffect(() => {
    if (user === null && localStorage.getItem('user') === null) {
      props.history.push('/login');
    }
  }, [user]);

  return (
    <div className='container'>
      <RecipeForm recipe={recipe} />
    </div>
  );
};

export default EditRecipePage;
