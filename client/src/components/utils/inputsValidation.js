import validator from 'validator';

const isNameValid = value => {
  if (!value || typeof value !== 'string') return { error: 'Name is empty!' };

  value = value.trim();

  if (!value) return { error: 'Name is empty!' };

  if (value.length < 2) return { error: 'Name is to short!' };

  if (value.length > 25) return { error: 'Name is to long!' };

  return { error: false, value };
};

const isEmailValid = value => {
  if (!value || typeof value !== 'string') return { error: 'Email is empty!' };

  value = value.trim();

  if (!value) return { error: 'Email is empty!' };

  if (!validator.isEmail(value)) return { error: 'Email is invalid!' };

  return { error: false, value };
};

const isPasswordValid = value => {
  if (!value || typeof value !== 'string')
    return { error: 'Password is empty!' };

  value = value.trim();

  if (!value) return { error: 'Password is empty!' };

  if (value.length < 7) return { error: 'Password is to short' };

  if (value.length > 100) return { error: 'Password is to long' };

  if (value.toLowerCase().includes('password'))
    return { error: 'Password cannot containe "password"!' };

  return { error: false, value };
};

const isTitleValid = value => {
  if (!value || typeof value !== 'string') return { error: 'Title is empty!' };

  value = value.trim();

  if (!value) return { error: 'Title is empty!' };

  if (value.length < 2) return { error: 'Title is to short' };

  if (value.length > 50) return { error: 'Title is to long' };

  return { error: false, value };
};

const isCategoryValid = value => {
  if (!value || typeof value !== 'string')
    return { error: 'Category is empty!' };

  value = value.trim();

  if (!value) return { error: 'Category is empty!' };

  if (value.length < 2) return { error: 'Category is to short' };

  if (value.length > 50) return { error: 'Category is to long' };

  return { error: false, value };
};

const isDescriptionValid = value => {
  if (!value || typeof value !== 'string')
    return { error: 'Description is empty!' };

  value = value.trim();

  if (!value) return { error: 'Description is empty!' };

  if (value.length < 5) return { error: 'Description is to short' };

  if (value.length > 100000) return { error: 'Description is to long' };

  return { error: false, value };
};

const areIngredientsValid = value => {
  if (!value || typeof value !== 'string')
    return { error: 'There are no ingredients!' };

  // Record separator; end of a record or row.
  const RS = String.fromCharCode(30);

  value = value
    .trim()
    .replace(/(\n|\r)+/g, RS)
    .replace(/\s+/g, ' ');
  const valueArr = value.split(RS).filter(ingredient => ingredient !== ' ');

  if (valueArr.length < 1) return { error: 'There are no ingredients!' };

  if (valueArr.length > 200) return { error: 'There are to many ingredients!' };

  const isAnyIngredientInvalid = valueArr.every(
    ingredient => ingredient.length < 200 && ingredient.length > 1
  );

  if (!isAnyIngredientInvalid)
    return { error: 'Each ingredient from 2 to 200 characters!' };

  return { error: false, value };
};

const isFileValid = file => {
  if (!file || typeof file !== 'object') return { error: 'No file added!' };

  const { type = false, size = false } = file;

  if (!type || !size || typeof type !== 'string' || typeof size !== 'number')
    return { error: 'File is invalid!' };

  if (size > 1000000) return { error: 'File is to large (1 mb or less)!' };

  isValidType: if (true) {
    if (type === 'image/jpeg') break isValidType;
    if (type === 'image/png') break isValidType;

    return { error: 'Please upload JPG, JPEG or PNG!' };
  }

  return { error: false, value: file };
};

export {
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isFileValid,
  areIngredientsValid,
  isDescriptionValid,
  isCategoryValid,
  isTitleValid,
};
