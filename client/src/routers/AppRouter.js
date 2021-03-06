import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import DashboardPage from '../components/DashboardPage';
import RecipePage from '../components/RecipePage';
import RecipesPage from '../components/RecipesPage';
import EditRecipePage from '../components/EditRecipePage';
import AccountPage from '../components/AccountPage';
import AccountEditPage from '../components/AccountEditPage';
import RecipeAddPage from '../components/RecipeAddPage';

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
        <Route
          path='/recipes/:id/edit'
          component={EditRecipePage}
          exact={true}
        />
        <Route path='/recipes/add' component={RecipeAddPage} />
        <Route path='/recipes/:id' component={RecipePage} />
        <Route path='/recipes' component={RecipesPage} />
        <Route path='/account/edit' component={AccountEditPage} />
        <Route path='/account' component={AccountPage} />
      </Switch>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRouter;
