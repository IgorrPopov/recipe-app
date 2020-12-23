import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from './UserContext';

import SearchForm from './SearchForm';

const Header = props => {
  const { user, setUser } = useContext(UserContext);
  const [avatarImg, setAvatarImg] = useState(null);

  const history = useHistory();

  history.listen(() => window.scrollTo(0, 0));

  useEffect(() => {
    if (user !== null) return;

    const userString = localStorage.getItem('user');

    if (userString === null) return;

    try {
      const userObj = JSON.parse(userString);
      setUser(userObj);
    } catch (e) {
      return;
    }
  }, [user]);

  useEffect(() => {
    if (user?.user?._id) {
      const avatar = (
        <img
          src={`/users/${user.user._id}/avatar`}
          alt='avatar'
          className='user-nav__avatar'
          onError={handleImgError}
        />
      );

      setAvatarImg(avatar);
    }
  }, [user]);

  const handleImgError = () => {
    setAvatarImg(null);
  };

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

      localStorage.removeItem('user');

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
              src='/img/yummy_bay_logo.png'
              alt='logo'
              className='header__logo'
            />
          </Link>
        </div>

        <SearchForm />
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
          <nav className='user-nav user-nav__logged-user'>
            {avatarImg ?? <i className='far fa-user'></i>}
            <div className='user-nav__dropdown'>
              <div className='user-nav__dropdown-title'>
                <i className='fas fa-angle-double-down'></i>Kitchen
              </div>
              <div className='user-nav__dropdown-content'>
                <Link to='/account'>
                  <i className='fas fa-user-alt'></i>My Account
                </Link>
                <Link to='/dashboard'>
                  <i className='fas fa-utensils'></i>My Recipes
                </Link>
                <Link to='/' onClick={handleLogOutClick}>
                  <i className='fas fa-sign-out-alt'></i>Logout
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
