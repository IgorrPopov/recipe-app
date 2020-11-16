import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const DashboardPage = props => {
  const { user, setUser } = useContext(UserContext);

  if (user === null) {
    props.history.push('/login');
  }

  return <div>{console.log(props)}</div>;
};

export default DashboardPage;
