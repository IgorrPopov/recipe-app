import React, { useState, useContext } from 'react';

import { UserContext } from './UserContext';
import {
  isNameValid,
  isEmailValid,
  isPasswordValid,
} from './utils/inputsValidation';

const SignupPage = props => {
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [email, setEmail] = useState('');
  const [inputsErrors, setInputsErrors] = useState({});

  const handleSignupFormSubmit = async e => {
    e.preventDefault();

    const isValidInputs = isInputsDataValid(
      name.trim(),
      email.trim(),
      password.trim()
    );

    if (!isValidInputs) return;

    try {
      let response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
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
        localStorage.setItem('user', JSON.stringify(user));
        // setInputsErrors({});

        props.history.push('/dashboard');
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

  const isPasswordMatch = (passwordOne, passwordTwo) =>
    passwordOne === passwordTwo;

  const isInputsDataValid = (name, email, password) => {
    const errors = {};

    const validName = isNameValid(name);
    const validEmail = isEmailValid(email);
    const validPassword = isPasswordValid(password);

    if (validName.error) errors.name = validName.error;
    if (validEmail.error) errors.email = validEmail.error;
    if (validPassword.error) errors.password = validPassword.error;

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
          <h4 className='signup-form-header'>Sign Up</h4>
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
                placeholder='Password Repeat'
              />
            </div>
            <div className='signup-form__box'>
              <button type='submit' className='button'>
                JOIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
