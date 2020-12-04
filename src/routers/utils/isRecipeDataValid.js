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
  const valueArr = value
    .trim()
    .replace(/(\n|\r)+/g, RS)
    .replace(/\s+/g, ' ')
    .split(RS)
    .filter(ingredient => ingredient !== ' ');

  if (valueArr.length < 1) return { error: 'There are no ingredients!' };

  if (valueArr.length > 200) return { error: 'There are to many ingredients!' };

  const isAnyIngredientInvalid = valueArr.every(
    ingredient => ingredient.length < 200 && ingredient.length > 1
  );

  if (!isAnyIngredientInvalid)
    return { error: 'Each ingredient from 2 to 50 characters!' };

  return { error: false, value: valueArr };
};

const isRecipeDataValid = body => {
  const allowedData = ['title', 'description', 'ingredients', 'category'];

  if (JSON.stringify(body) === '{}')
    return { error: { general: 'Request is empty!' } };

  const isReqValid = Object.keys(body).every(data =>
    allowedData.includes(data)
  );

  if (!isReqValid) return { error: { general: 'Request is invalid!' } };

  const validTitle = isTitleValid(body.title);
  if (validTitle.error) return { error: { title: validTitle.error } };

  const validDescription = isDescriptionValid(body.description);
  if (validDescription.error)
    return { error: { description: validDescription.error } };

  const validIngredients = areIngredientsValid(body.ingredients);
  if (validIngredients.error)
    return { error: { ingredients: validIngredients.error } };

  const validCategory = isCategoryValid(body.category);
  if (validCategory.error) return { error: { category: validCategory.error } };

  return {
    error: false,
    recipe: {
      title: validTitle.value,
      description: validDescription.value,
      ingredients: validIngredients.value,
      category: validCategory.value,
    },
  };
};

module.exports = isRecipeDataValid;
