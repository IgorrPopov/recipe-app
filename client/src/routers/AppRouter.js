import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import DashboardPage from '../components/DashboardPage';

import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRouter = () => (
  <BrowserRouter>
    <Header />
    <main>
      <Switch>
        <Route path='/' component={HomePage} exact={true} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/dashboard' component={DashboardPage} />
        <Route path='/login' component={LoginPage} />
      </Switch>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRouter;
