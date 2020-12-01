import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

const RecipeForm = () => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fileText, setFileText] = useState('No file chosen, yet');

  const handleAddPhotoButtonClick = () => {
    document.getElementById('file').click();
  };

  const handleFileInputChange = e => {
    const file = document.getElementById('file');

    setPhoto(e.target.files[0]);

    if (file.value) {
      setFileText(file.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    }
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = e => {
    setCategory(e.target.value);
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleIngredientsChange = e => {
    setIngredients(e.target.value);
  };

  const sendForm = async () => {
    const token = user && user.token;

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('ingredients', ingredients);
    fd.append('category', category);
    fd.append('photo', photo);

    for (let key of fd.keys()) {
      console.log(`${key}:`, fd.get(key));
    }
    console.log('---------------------');

    try {
      const response = await fetch('/recipesIMG', {
        method: 'POST',
        headers: {
          'Content-Type':
            'multipart/form-data; boundary=<calculated when request is sent>',
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      console.log({ response });
    } catch (e) {}
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
  };

  return (
    <form className='recipe-form' onSubmit={handleFormSubmit}>
      <div className='recipe-form__box recipe-form__box--title'>
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
        <input
          hidden='hidden'
          onChange={handleFileInputChange}
          type='file'
          name='photo'
          id='file'
        />
        <button onClick={handleAddPhotoButtonClick}>Add photo</button>
        <span id='file-text'>{fileText}</span>
      </div>
      <div className='recipe-form__box recipe-form__box--add-button'>
        <button onClick={sendForm}>Add recipe</button>
      </div>
    </form>
  );
};
export default RecipeForm;
