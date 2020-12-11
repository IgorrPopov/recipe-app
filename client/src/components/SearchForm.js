import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SearchForm = props => {
  const [input, setInput] = useState('');
  const history = useHistory();

  const handleInputChange = e => {
    const value = e.target.value;
    setInput(value);
  };

  const handleSearchFormSubmit = async e => {
    e.preventDefault();

    if (!input || typeof input !== 'string' || !input.trim()) {
      return;
    }

    try {
      let response = await fetch(`/recipes/search/${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'json/application',
        },
      });

      setInput('');

      if (response.status === 200) {
        response = await response.json();
        // console.log('Seach form se');
        history.push({
          pathname: '/recipes',
          state: {
            recipes: response.recipes,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSearchFormSubmit} className='search-form'>
      <input
        type='text'
        className='search-form__input'
        placeholder='Find a Recipe'
        value={input}
        onChange={handleInputChange}
      />
      <button type='submit' className='search-form__button'>
        Go
      </button>
    </form>
  );
};

export default SearchForm;
