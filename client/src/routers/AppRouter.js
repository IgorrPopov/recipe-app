import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import DashboardPage from '../components/DashboardPage';
import RecipePage from '../components/RecipePage';

import Header from '../components/Header';
import Footer from '../components/Footer';

// const RecipePage = lazy(() => import('../components/RecipePage'));

const AppRouter = () => (
  <BrowserRouter>
    <Header />
    <main>
      <Switch>
        <Route path='/' component={HomePage} exact={true} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/dashboard' component={DashboardPage} />
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Route path='/recipes/:id' component={RecipePage} />
        {/* </Suspense> */}
      </Switch>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRouter;
