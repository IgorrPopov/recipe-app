import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

import MyRecipeCard from './MyRecipeCard';

const DashboardPage = props => {
  const { user } = useContext(UserContext);

  if (user === null) {
    props.history.push('/login');
  }

  const [RECIPES_LIMIT] = useState(10);
  const [recipesSkip, setRecipesSkip] = useState(RECIPES_LIMIT);
  const [deleteId, setDeleteId] = useState('');
  const [deleteTitle, setDeleteTitle] = useState('');

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const recipeForDelete = recipes.filter(recipe => recipe._id === deleteId);
    setDeleteTitle(recipeForDelete.length > 0 ? recipeForDelete[0].title : '');
  }, [deleteId]);

  useEffect(() => {
    const getRecipes = async () => {
      const token = user && user.token;

      try {
        let response = await fetch(`/recipes?limit=${RECIPES_LIMIT}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          response = await response.json();
          // console.log({ response });
          // const recipesArr = response.recipes;

          if (response && response.length > 0) {
            setRecipes(response);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    getRecipes();
  }, []);

  const loadRecipes = async () => {
    const token = user && user.token;

    try {
      let response = await fetch(
        `/recipes?limit=${RECIPES_LIMIT}&skip=${recipesSkip}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        response = await response.json();

        if (response && response.length > 0) {
          setRecipes([...recipes, ...response]);
          setRecipesSkip(recipesSkip + RECIPES_LIMIT);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteRecipe = _id => {
    const deleteModal = document.getElementById('delete-modal');
    const closeButton = document.getElementsByClassName(
      'delete-modal__close-button'
    )[0];

    deleteModal.style.display = 'block';
    setDeleteId(_id);

    closeButton.onclick = () => {
      deleteModal.style.display = 'none';
      setDeleteId('');
    };

    window.onclick = e => {
      if (e.target == deleteModal) {
        deleteModal.style.display = 'none';
        setDeleteId('');
      }
    };
  };

  const deleteRecipe = async _id => {
    if (!_id) return;

    const token = user && user.token;

    try {
      let response = await fetch(`/recipes/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'json/application',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        response = await response.json();

        const filteredRecipes = recipes.filter(
          recipe => recipe._id !== response._id
        );

        setRecipes(filteredRecipes);
        document.getElementById('delete-modal').style.display = 'none';
        setDeleteId('');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNoButtonClick = () => {
    document.getElementById('delete-modal').style.display = 'none';
    setDeleteId('');
  };

  const handleEditButtonClick = recipe => {
    if (!recipe || !recipe._id) return;

    props.history.push({
      pathname: `/recipes/${recipe._id}/edit`,
      state: { recipe },
    });
  };

  const handleAddRecipeClick = () => {
    props.history.push('/recipes/add');
  };

  return (
    <div className='container'>
      <div className='dashboard__header'>
        <div className='dashboard__title'>Your recipe collection</div>
        <button
          className='button button--add-recipe'
          onClick={handleAddRecipeClick}
        >
          +
        </button>
      </div>
      {recipes.length > 0 &&
        recipes.map(recipe => (
          <MyRecipeCard
            key={recipe._id}
            recipe={recipe}
            handleDeleteRecipe={handleDeleteRecipe}
            handleEditButtonClick={handleEditButtonClick}
          />
        ))}
      <button onClick={loadRecipes} className='button button--load-more-button'>
        Load more
      </button>

      {/* Delete modal */}
      <div id='delete-modal' className='delete-modal'>
        <div className='delete-modal__content'>
          <span className='delete-modal__close-button'>&times;</span>
          <p className='delete-modal__text'>
            Are you sure you want to delete "{deleteTitle}" recipe?
          </p>
          <div className='delete-modal__actions'>
            <button
              className='button button__my-recipe-card'
              onClick={handleNoButtonClick}
            >
              No
            </button>
            <button
              className='button button__my-recipe-card button__my-recipe-card--delete'
              onClick={() => deleteRecipe(deleteId)}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
