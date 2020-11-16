import React, { useState } from 'react';

import validator from 'validator';

const SignupPage = props => {
  // console.log(props.history)

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
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

        setInputsErrors({});
        console.log(user);
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

  const isNameValid = value => {
    if (!value) return { error: 'Name is empty!' };

    if (value.length < 2) return { error: 'Name is to short!' };

    if (value.length > 25) return { error: 'Name is to long!' };

    return { error: false, value };
  };

  const isEmailValid = value => {
    if (!value) return { error: 'Email is empty!' };

    if (!validator.isEmail(value)) return { error: 'Email is invalid!' };

    return { error: false, value };
  };

  const isPasswordValid = value => {
    if (!value) return { error: 'Password is empty!' };

    if (value.length < 7) return { error: 'Password is to short' };

    if (value.length > 100) return { error: 'Password is to long' };

    if (value.toLowerCase().includes('password'))
      return { error: 'Password cannot containe "password"!' };

    return { error: false, value };
  };

  const isInputsDataValid = (name, email, password) => {
    const errors = {};

    const validName = isNameValid(name);
    const validEmail = isEmailValid(email);
    const validPassword = isPasswordValid(password);

    if (validName.error) errors.name = validName.error;
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
            {!inputsErrors.name || (
              <span className='input-error-message'>{inputsErrors.name}</span>
            )}
            <label htmlFor='name' className='signup-form__label'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={handleNameChange}
              className='signup-form__input'
            />
          </div>
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
              name='password'
              id='password'
              value={password}
              onChange={handlePasswordChange}
              className='signup-form__input'
            />
          </div>
          <div className='signup-form__box'>
            <button type='submit' className='button'>
              Join
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
