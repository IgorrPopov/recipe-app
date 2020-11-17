import React, { useContext } from 'react';
import { UserContext } from './UserContext';

import AddRecipeForm from './AddRecipeForm';

const DashboardPage = props => {
  const { user } = useContext(UserContext);

  if (user === null) {
    props.history.push('/login');
  }

  return (
    <div>
      <AddRecipeForm />
    </div>
  );
};

export default DashboardPage;
