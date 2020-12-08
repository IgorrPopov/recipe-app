import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from './UserContext';

const Header = props => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  history.listen(() => window.scrollTo(0, 0));

  console.log('header rendered');
  useEffect(() => {
    console.log('useEffect');
  }, []);

  const handleLogOutClick = async () => {
    const token = user && user.token;

    if (!token) return;

    try {
      await fetch('/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(() => {
        history.push('/');
        return null;
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
          <button className='search-form__button'>Go</button>
        </form>
        {user === null ? (
          <nav className='user-nav'>
            <Link to='/signup'>
              <div className='user-nav__box'>Join</div>
            </Link>
            <div className='user-nav__line'></div>
            <Link to='/login'>
              <div className='user-nav__box'>Login</div>
            </Link>
          </nav>
        ) : (
          <>
            <div>
              <Link to='/dashboard'>Kitchen</Link>
            </div>
            <button onClick={handleLogOutClick}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
