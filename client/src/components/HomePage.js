import React, { useState, useEffect } from 'react';

import BigRecipeCard from './BigRecipeCard';
import RecipesList from './RecipesList';

const HomePage = () => {
  const [RECIPES_LIMIT] = useState(6);
  const [startRecipesLimit] = useState(RECIPES_LIMIT + 1);
  const [recipesSkip, setRecipesSkip] = useState(startRecipesLimit);

  const [recipes, setRecipes] = useState([]);
  const [titleRecipe, setTitleRecipe] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        let response = await fetch(`/recipesAll?limit=${startRecipesLimit}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          response = await response.json();

          const recipesArr = response.recipes;

          if (recipesArr.length > 0) {
            // recipesArr.sort(() => 0.5 - Math.random());
            setTitleRecipe(recipesArr[0]);
            setRecipes(recipesArr.filter((elm, index) => index !== 0));
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    getRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      let response = await fetch(
        `/recipesAll?limit=${RECIPES_LIMIT}&skip=${recipesSkip}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        response = await response.json();

        const recipesArr = response.recipes;

        if (recipesArr.length > 0) {
          setRecipes([...recipes, ...recipesArr]);
          setRecipesSkip(recipesSkip + RECIPES_LIMIT);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <section className='section-about'>
        <div className='section-about__container'>
          <div className='section-about__text-box'>
            <div className='heading-primary-box'>
              <h1 className='heading-primary'>
                <span className='heading-primary__text'>Life tastes great</span>
              </h1>
              <span className='heading-primary__sticker'>and</span>
            </div>
            <h2 className='heading-secondary'>
              <span className='heading-secondary__char1'>A</span>
              <span className='heading-secondary__char2'>l</span>
              <span className='heading-secondary__char3'>l</span>
              <span> </span>
              <span className='heading-secondary__char4'>y</span>
              <span className='heading-secondary__char5'>o</span>
              <span className='heading-secondary__char6'>u</span>
              <span> </span>
              <span className='heading-secondary__char7'>n</span>
              <span className='heading-secondary__char8'>e</span>
              <span className='heading-secondary__char9'>e</span>
              <span className='heading-secondary__char10'>d</span>
              <span> </span>
              <span className='heading-secondary__char11'>i</span>
              <span className='heading-secondary__char12'>s</span>
              <span> </span>
              <span className='heading-secondary__char13'>F</span>
              <span className='heading-secondary__char14'>O</span>
              <span className='heading-secondary__char15'>O</span>
              <span className='heading-secondary__char16'>D</span>
            </h2>
          </div>
        </div>
      </section>
      <section className='section-recipes'>
        <div className='section-recipes__container'>
          {!titleRecipe || (
            <div className='section-recipes__big-card-wrapper'>
              <BigRecipeCard recipe={titleRecipe} />
            </div>
          )}

          {!recipes.length || <RecipesList recipes={recipes} />}
          <button
            onClick={loadRecipes}
            className='button button--load-more-button'
          >
            Load more
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
