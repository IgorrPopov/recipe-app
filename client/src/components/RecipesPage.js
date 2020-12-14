import React, { useState, useEffect } from 'react';
import RecipesList from './RecipesList';

const RecipesPage = props => {
  const [recipes, setRecipes] = useState(
    props?.history?.location?.state?.recipes || []
  );

  useEffect(() => {
    setRecipes(props?.history?.location?.state?.recipes || []);
  }, [props.history.location.state]);

  return (
    <div className='section-recipes__container'>
      {recipes.length ? (
        <RecipesList recipes={recipes} />
      ) : (
        <div className='invalid-search-message'>
          Did not match any recipe, try again
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
