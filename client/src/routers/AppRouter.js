import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRouter = () => (
  <BrowserRouter>
    <Header />
    <main>
      <Switch>
        <Route path='/' component={HomePage} exact={true} />
        <Route path='/signup' component={SignupPage} />
      </Switch>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRouter;
