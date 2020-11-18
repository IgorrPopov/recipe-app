import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

const AddRecipeForm = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleOpenFormButtonClick = () => {
    setIsOpen(!isOpen);
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

  const handleFormSubmit = e => {
    e.preventDefault();
  };

  return (
    <>
      {isOpen ? (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <label htmlFor='category'>Category</label>
            <input
              type='text'
              id='category'
              name='category'
              value={category}
              onChange={handleCategoryChange}
            />
          </div>
          <div>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              id='description'
              name='description'
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div>
            <label htmlFor='ingredients'>Ingredients</label>
            <textarea
              id='ingredients'
              name='ingredients'
              value={ingredients}
              onChange={handleIngredientsChange}
              placeholder='Separate ingredients with a space'
            />
          </div>
          <div>
            <input type='file' />
          </div>
          <div>
            <button>Add</button>
          </div>
        </form>
      ) : (
        <div>
          <button onClick={handleOpenFormButtonClick}>+</button>
        </div>
      )}
    </>
  );
};

export default AddRecipeForm;
