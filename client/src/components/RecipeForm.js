import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import {
  isFileValid,
  areIngredientsValid,
  isDescriptionValid,
  isCategoryValid,
  isTitleValid,
} from './utils/inputsValidation';

const RecipeForm = () => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [photo, setPhoto] = useState(undefined);
  const [fileText, setFileText] = useState('No file chosen, yet');
  const [inputsErrors, setInputsErrors] = useState({});

  const handleTitleChange = e => setTitle(e.target.value);
  const handleCategoryChange = e => setCategory(e.target.value);
  const handleDescriptionChange = e => setDescription(e.target.value);
  const handleIngredientsChange = e => setIngredients(e.target.value);

  const handleAddPhotoButtonClick = () =>
    document.getElementById('file').click();

  const handleFileInputChange = e => {
    const file = e.target.files[0];

    if (file && file.name) {
      setFileText(file.name);
      return setPhoto(file);
    }

    setFileText('No file chosen, yet');
    setPhoto(undefined);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const validRecipe = isValidRecipe({
      title,
      description,
      ingredients,
      category,
      photo,
    });

    if (!validRecipe) return;

    const token = user && user.token;

    const fd = new FormData();
    fd.append('title', validRecipe.title);
    fd.append('description', validRecipe.description);
    fd.append('ingredients', validRecipe.ingredients);
    fd.append('category', validRecipe.category);
    fd.append('photo', validRecipe.photo);

    try {
      const response = await fetch('/recipesIMG', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      console.log({ response });
    } catch (e) {}
  };

  const isValidRecipe = value => {
    const { title, category, description, ingredients, photo } = value;

    const validTitle = isTitleValid(title);
    const validCategory = isCategoryValid(category);
    const validDescription = isDescriptionValid(description);
    const validIngredients = areIngredientsValid(ingredients);
    const validPhoto = isFileValid(photo);

    const errors = {};

    if (validTitle.error) errors.title = validTitle.error;
    if (validCategory.error) errors.category = validCategory.error;
    if (validDescription.error) errors.description = validDescription.error;
    if (validIngredients.error) errors.ingredients = validIngredients.error;
    if (validPhoto.error) errors.photo = validPhoto.error;

    if (JSON.stringify(errors) === '{}') {
      setInputsErrors({});
      return {
        title: validTitle.value,
        category: validCategory.value,
        description: validDescription.value,
        ingredients: validIngredients.value,
        photo: validPhoto.value,
      };
    }

    setInputsErrors({ ...errors });

    return false;
  };

  return (
    <form className='recipe-form' onSubmit={handleFormSubmit}>
      <div className='recipe-form__box recipe-form__box--title'>
        {!inputsErrors.title || (
          <span className='input-error-message input-error-message--recipe-form input-error-message--title'>
            {inputsErrors.title}
          </span>
        )}
        <label className='recipe-form__label' htmlFor='title'>
          Recipe for
        </label>
        <input
          className='recipe-form__input-text'
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={handleTitleChange}
          placeholder='Title'
        />
      </div>
      <div className='recipe-form__box recipe-form__box--category'>
        {!inputsErrors.category || (
          <span className='input-error-message input-error-message--recipe-form'>
            {inputsErrors.category}
          </span>
        )}
        <label className='recipe-form__label' htmlFor='category'>
          Category
        </label>
        <input
          className='recipe-form__input-text'
          type='text'
          id='category'
          name='category'
          value={category}
          onChange={handleCategoryChange}
          placeholder='Salad'
        />
      </div>
      <div className='recipe-form__box recipe-form__box--description'>
        {!inputsErrors.description || (
          <span className='input-error-message input-error-message--recipe-form'>
            {inputsErrors.description}
          </span>
        )}
        <label className='recipe-form__label' htmlFor='description'>
          Description
        </label>
        <textarea
          className='recipe-form__textarea'
          id='description'
          name='description'
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div className='recipe-form__box recipe-form__box--ingredients'>
        {!inputsErrors.ingredients || (
          <span className='input-error-message input-error-message--recipe-form'>
            {inputsErrors.ingredients}
          </span>
        )}
        <label className='recipe-form__label' htmlFor='ingredients'>
          Ingredients
        </label>
        <textarea
          className='recipe-form__textarea recipe-form__textarea--ingredients'
          id='ingredients'
          name='ingredients'
          value={ingredients}
          onChange={handleIngredientsChange}
          placeholder='Separate ingredients with a space'
        />
      </div>
      <div className='recipe-form__box recipe-form__box--file-button'>
        {!inputsErrors.photo || (
          <span className='input-error-message input-error-message--recipe-form input-error-message--file'>
            {inputsErrors.photo}
          </span>
        )}
        <input
          hidden='hidden'
          onChange={handleFileInputChange}
          type='file'
          name='photo'
          id='file'
        />
        <button type='button' onClick={handleAddPhotoButtonClick}>
          Add photo
        </button>
        <span id='file-text'>{fileText}</span>
      </div>
      <div className='recipe-form__box recipe-form__box--add-button'>
        <button type='submit'>Add recipe</button>
      </div>
    </form>
  );
};
export default RecipeForm;
