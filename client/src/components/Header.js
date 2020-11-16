import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className='header'>
    <div className='header__container'>
      <div className='header__logo-box'>
        <Link to='/'>
          <img
            src='./img/yummy_bay_logo.png'
            alt='logo'
            className='header__logo'
          />
        </Link>
      </div>

      <form action='#' className='search-form'>
        <input
          type='text'
          className='search-form__input'
          placeholder='Find a Recipe'
        />
        <button className='search-form__button'>
          <span className='search-form__button-word'>Go</span>
        </button>
      </form>

      <nav className='user-nav'>
        <Link to='/signup'>
          <div className='user-nav__box'>Join</div>
        </Link>
        <div className='user-nav__line'></div>
        <Link to='/login'>
          <div className='user-nav__box'>Login</div>
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
