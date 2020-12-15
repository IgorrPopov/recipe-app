import React, { useState, useContext } from 'react';

import { UserContext } from './UserContext';
import {
  isNameValid,
  isEmailValid,
  isPasswordValid,
} from './utils/inputsValidation';

const AccountEditPage = props => {
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState(user?.user?.name || '');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [email, setEmail] = useState(user?.user?.email || '');
  const [inputsErrors, setInputsErrors] = useState({});

  const handleSignupFormSubmit = async e => {
    e.preventDefault();

    const isValidInputs = isInputsDataValid(
      name.trim(),
      email.trim(),
      password.trim()
    );

    if (!isValidInputs) return;

    const updates = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      currentPassword: currentPassword.trim(),
    };

    updates.filter = function () {
      const updates = this;
      delete updates.filter;

      return Object.entries(updates)
        .filter(([key, value]) => value)
        .reduce((accum, [key, value]) => {
          accum[key] = value;
          return accum;
        }, {});
    };

    const validUpdates = updates.filter();

    if (JSON.stringify(validUpdates) === '{}') return;

    try {
      const token = user && user.token;

      let response = await fetch('/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validUpdates),
      });

      if (response.status === 400) {
        response = await response.json();

        if (response.error) {
          setInputsErrors({ ...response.error });
        }
      }

      if (response.status === 200) {
        const user = await response.json();

        console.log({ user });

        setUser(user3);

        setTimeout(() => {
          console.log({ user });
        }, 2000);

        // setInputsErrors({});

        props.history.push('/account');
      }
    } catch (error) {}
  };

  const handleNameChange = e => {
    let value = e.target.value;

    setName(value);
  };

  const handleEmailChange = e => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
  };

  const handlePasswordRepeatChange = e => {
    const value = e.target.value;
    setPasswordRepeat(value);
  };

  const handleCurrentPasswordChange = e => {
    const value = e.target.value;
    setCurrentPassword(value);
  };

  const isPasswordMatch = (passwordOne, passwordTwo) =>
    passwordOne === passwordTwo;

  const isInputsDataValid = (name, email, password) => {
    const errors = {};

    if (name) {
      const validName = isNameValid(name);
      if (validName.error) errors.name = validName.error;
    }

    if (email) {
      const validEmail = isEmailValid(email);
      if (validEmail.error) errors.email = validEmail.error;
    }

    if (password) {
      const validPassword = isPasswordValid(password);
      if (validPassword.error) errors.password = validPassword.error;
    }

    if (
      JSON.stringify(errors) === '{}' &&
      isPasswordMatch(password, passwordRepeat)
    ) {
      setInputsErrors({});
      return true;
    }

    setInputsErrors({ ...errors });

    return false;
  };

  return (
    <section className='section-signup'>
      <div className='circle circle--primary'></div>
      <div className='circle circle--secondary'></div>
      <div className='section-signup__container'>
        <div className='signup-form-wrapper'>
          <h4 className='signup-form-header'>Edit Account</h4>
          <form onSubmit={handleSignupFormSubmit} className='signup-form'>
            <div className='signup-form__box'>
              {!inputsErrors.name || (
                <span className='input-error-message'>{inputsErrors.name}</span>
              )}
              {!inputsErrors.general || (
                <span className='input-error-message'>
                  {inputsErrors.general}
                </span>
              )}
              {/* <label htmlFor='name' className='signup-form__label'>
              Name
            </label> */}
              <input
                type='text'
                name='name'
                autoComplete='name'
                id='name'
                value={name}
                onChange={handleNameChange}
                className='signup-form__input'
                placeholder='Name'
              />
            </div>
            <div className='signup-form__box'>
              {!inputsErrors.email || (
                <span className='input-error-message'>
                  {inputsErrors.email}
                </span>
              )}
              {/* <label htmlFor='email' className='signup-form__label'>
              Email
            </label> */}
              <input
                type='text'
                name='email'
                autoComplete='email'
                id='email'
                value={email}
                onChange={handleEmailChange}
                className='signup-form__input'
                placeholder='Email'
              />
            </div>
            {/*  */}

            <div className='signup-form__box'>
              <input
                type='password'
                autoComplete='current-password'
                name='current-password'
                id='current-password'
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                className='signup-form__input'
                placeholder='Your Current Password (required)'
              />
            </div>

            {/*  */}
            <div className='signup-form__box'>
              {!inputsErrors.password || (
                <span className='input-error-message'>
                  {inputsErrors.password}
                </span>
              )}
              {/* <label htmlFor='password' className='signup-form__label'>
              Password
            </label> */}
              <input
                type='password'
                autoComplete='new-password'
                name='password'
                id='password'
                value={password}
                onChange={handlePasswordChange}
                className='signup-form__input'
                placeholder='New Password'
              />
            </div>
            <div className='signup-form__box'>
              {password === passwordRepeat || (
                <span className='input-error-message'>
                  Password doesn't match
                </span>
              )}
              {/* <label htmlFor='password-repeat' className='signup-form__label'>
              Repeat Password
            </label> */}
              <input
                type='password'
                autoComplete='new-password'
                name='password-repeat'
                id='password-repeat'
                value={passwordRepeat}
                onChange={handlePasswordRepeatChange}
                className='signup-form__input'
                placeholder='New Password Repeat'
              />
            </div>
            <div className='signup-form__box'>
              <button type='submit' className='button'>
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AccountEditPage;
