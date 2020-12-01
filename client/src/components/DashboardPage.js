import React, { useContext } from 'react';
import { UserContext } from './UserContext';

import ToggleButton from './ToggleButton';

const DashboardPage = props => {
  const { user } = useContext(UserContext);

  if (user === null) {
    props.history.push('/login');
  }

  return (
    <div className='dashboard__container'>
      <ToggleButton />
    </div>
  );
};

export default DashboardPage;
