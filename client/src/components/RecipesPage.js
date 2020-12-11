import React, { useState, useEffect } from 'react';

const RecipesPage = props => {
  const [recipes, setRecipes] = useState(
    props?.history?.location?.state?.recipes || []
  );

  useEffect(() => {
    setRecipes(props?.history?.location?.state?.recipes || []);
  }, [props.history.location.state]);

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe._id}>{recipe.title}</div>
      ))}
    </div>
  );
};

export default RecipesPage;
