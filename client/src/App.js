import React, { useState } from 'react';
import AppRouter from './routers/AppRouter';
import { UserContext } from './components/UserContext';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <AppRouter />
      </UserContext.Provider>
    </>
  );
};

export default App;
