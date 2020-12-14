import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const AccountPage = props => {
  const [avatarImg, setAvatarImg] = useState(undefined);
  const { user } = useContext(UserContext);
  //   console.log({ user });

  useEffect(() => {
    if (user?.user?._id) {
      const avatar = (
        <img
          src={`/users/${user.user._id}/avatar`}
          alt='avatar'
          className='account-card__avatar'
          onError={handleImgError}
        />
      );

      setAvatarImg(avatar);
    }
  }, [user]);

  const handleImgError = () => {
    setAvatarImg(undefined);
  };

  return (
    <div className='account__container'>
      <div className='account-card'>
        <div className='account-card__img'>
          {avatarImg ?? (
            <>
              <i className='far fa-grin-beam account-card__icon'></i>
              {/* <button className='button button--upload-avatar'>
                Upload Avatar
              </button> */}
            </>
          )}
        </div>
        <form action='' className='account-card__actions'>
          <h5>My Account</h5>
          <div className='account-card__signup-date'>
            {`Joined ${user?.user?.createdAt
              .split('T')[0]
              .split('-')
              .reverse()
              .join('.')}`}
          </div>
          <Link className='button-text'>Show My Recipes</Link>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
