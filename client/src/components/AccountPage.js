import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';
import { isFileValid } from './utils/inputsValidation';

const AccountPage = props => {
  const [avatarImg, setAvatarImg] = useState(null);
  const [fileText, setFileText] = useState('No file chosen, yet');
  const [photo, setPhoto] = useState(undefined);
  const [avatarError, setAvatarError] = useState('');
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const loadAvatar = () => {
    // console.log('loadAvatar();');
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
  };

  useEffect(loadAvatar, [user]);

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

      setUser(() => {
        history.push('/');
        return null;
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddPhotoButtonClick = () =>
    document.getElementById('file').click();

  const handleFileInputChange = e => {
    const file = e.target.files[0];

    if (file && file.name) {
      let text = file.name;

      text = text.length <= 25 ? text : text.substring(0, 25).trim() + '...';

      setFileText(text);
      setAvatarError('');
      return setPhoto(file);
    }

    setFileText('No file chosen, yet');
    setPhoto(undefined);
  };

  const handleSendPhotoClick = async () => {
    // console.log({ handleSendPhotoClick });
    if (!photo) return;

    const validPhoto = isFileValid(photo);

    if (!validPhoto.error) {
      setAvatarImg(undefined); // to rerender

      const token = user && user.token;

      const fd = new FormData();
      fd.append('avatar', validPhoto.value);

      try {
        const response = await fetch('/users/me/avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        // console.log({ response });

        if (response.status === 200) {
          loadAvatar();
          setAvatarError('');

          // change avatar img in the Header
          const elm = document.querySelector('.user-nav__avatar');
          elm.src = `/users/${user.user._id}/avatar`;
        }
      } catch (e) {}
    } else {
      setAvatarError(validPhoto.error);
    }
  };

  return (
    <div className='account__container'>
      <div className='account-card'>
        <div className='account-card__img'>
          {avatarImg ?? <i className='far fa-grin-beam account-card__icon' />}
          {avatarError && (
            <span className='input-error-message'>{avatarError}</span>
          )}
          <div className='account-card__upload-avatar'>
            <input
              hidden='hidden'
              onChange={handleFileInputChange}
              type='file'
              id='file'
            />
            <button
              type='button'
              onClick={handleAddPhotoButtonClick}
              className='button button--upload-avatar'
            >
              {avatarImg ? 'Change avatar' : 'Add avatar'}
            </button>
            <span>{fileText}</span>
            {fileText !== 'No file chosen, yet' && (
              <button
                onClick={handleSendPhotoClick}
                className='button button--upload-avatar'
              >
                Send
              </button>
            )}
          </div>
        </div>
        <form action='' className='account-card__actions'>
          <h5>{user?.user?.name}</h5>
          <div className='account-card__signup-date'>
            {`Joined ${user?.user?.createdAt
              .split('T')[0]
              .split('-')
              .reverse()
              .join('.')}`}
          </div>
          <div className='account-card__email'>
            Email: <span>{user?.user?.email}</span>
          </div>
          <Link to='/recipes' className='button-text'>
            Show My Recipes
          </Link>
          <Link to='/account/edit' className='button-text'>
            Edit Account
          </Link>
          <Link to='/' onClick={handleLogOutClick} className='button-text'>
            LogOut
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
