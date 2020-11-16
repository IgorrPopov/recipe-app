import React, { useState, useContext } from 'react';

import { UserContext } from './UserContext';
import { isEmailValid, isPasswordValid } from './utils/inputsValidation';

const LoginPage = props => {
  const { user, setUser } = useContext(UserContext);

  const [password, setPassword] = useState('1111111');
  const [email, setEmail] = useState('1@gmail.com');
  const [inputsErrors, setInputsErrors] = useState({});

  const handleSignupFormSubmit = async e => {
    e.preventDefault();

    const isValidInputs = isInputsDataValid(email.trim(), password.trim());

    if (!isValidInputs) return;

    try {
      let response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (response.status === 400) {
        response = await response.json();

        if (response.error) {
          setInputsErrors({ ...response.error });
        }
      }

      if (response.status === 201) {
        const user = await response.json();

        setUser({ ...user });

        // setInputsErrors({});

        props.history.push('/dashboard');
      }
    } catch (error) {}
  };

  const handleEmailChange = e => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
  };

  const isInputsDataValid = (email, password) => {
    const errors = {};

    const validEmail = isEmailValid(email);
    const validPassword = isPasswordValid(password);

    if (validEmail.error) errors.email = validEmail.error;
    if (validPassword.error) errors.password = validPassword.error;

    if (JSON.stringify(errors) === '{}') {
      setInputsErrors({});
      return true;
    }

    setInputsErrors({ ...errors });

    return false;
  };

  return (
    <section className='section-signup'>
      <div className='section-signup__container'>
        <form onSubmit={handleSignupFormSubmit} className='signup-form'>
          <div className='signup-form__box'>
            {!inputsErrors.email || (
              <span className='input-error-message'>{inputsErrors.email}</span>
            )}
            <label htmlFor='email' className='signup-form__label'>
              Email
            </label>
            <input
              type='text'
              name='email'
              autoComplete='email'
              id='email'
              value={email}
              onChange={handleEmailChange}
              className='signup-form__input'
              placeholder='something@mail.com'
            />
          </div>
          <div className='signup-form__box'>
            {!inputsErrors.password || (
              <span className='input-error-message'>
                {inputsErrors.password}
              </span>
            )}
            <label htmlFor='password' className='signup-form__label'>
              Password
            </label>
            <input
              type='password'
              autoComplete='new-password'
              name='password'
              id='password'
              value={password}
              onChange={handlePasswordChange}
              className='signup-form__input'
            />
          </div>
          <div className='signup-form__box'>
            <button type='submit' className='button'>
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
