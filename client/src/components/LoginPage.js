import React, { useState, useContext } from 'react';

import { UserContext } from './UserContext';
import { isEmailValid } from './utils/inputsValidation';

const LoginPage = props => {
  const { setUser } = useContext(UserContext);

  const [password, setPassword] = useState('1111111');
  const [email, setEmail] = useState('abigail.dunn@gmail.com');
  const [inputsErrors, setInputsErrors] = useState({});

  const handleSignupFormSubmit = async e => {
    e.preventDefault();

    const isValidInputs = isInputsDataValid(email.trim());

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

      if (response.status === 200) {
        const user = await response.json();

        setUser({ ...user });

        props.history.push('/dashboard');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEmailChange = e => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
  };

  const isInputsDataValid = email => {
    const errors = {};

    const validEmail = isEmailValid(email);

    if (validEmail.error) errors.email = validEmail.error;

    if (JSON.stringify(errors) === '{}') {
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
          <h4 className='signup-form-header'>Sign In</h4>
          <form onSubmit={handleSignupFormSubmit} className='signup-form'>
            <div className='signup-form__box'>
              {!inputsErrors.email || (
                <span className='input-error-message'>
                  {inputsErrors.email}
                </span>
              )}
              {!inputsErrors.general || (
                <span className='input-error-message'>
                  {inputsErrors.general}
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
                placeholder='Password'
              />
            </div>
            <div className='signup-form__box'>
              <button type='submit' className='button'>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
