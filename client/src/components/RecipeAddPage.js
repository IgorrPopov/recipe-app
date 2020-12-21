import React, { useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import RecipeForm from './RecipeForm';

const RecipeAddPage = props => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user === null && localStorage.getItem('user') === null) {
      props.history.push('/login');
    }
  }, [user]);

  return (
    <div className='container'>
      <RecipeForm />
    </div>
  );
};

export default RecipeAddPage;
