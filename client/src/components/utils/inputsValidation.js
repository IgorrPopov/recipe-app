import validator from 'validator';

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

export { isNameValid, isEmailValid, isPasswordValid };
