const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
    },
    ingredients: {
      type: [String],
      required: true,
      trim: true,
      validate(arr) {
        if (!arr.length) {
          throw new Error('Ingredients are required!');
        }

        arr.forEach(ingredient => {
          if (ingredient.length === 0) {
            throw new Error('Ingredients description is empty!');
          }

          if (ingredient.length < 2) {
            throw new Error('Ingredients description is to short!');
          }

          if (ingredient.length > 200) {
            throw new Error('Ingredients description is to long!');
          }
        });
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    photo: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.methods.toJSON = function () {
  const recipe = this;

  const recipeObj = recipe.toObject();

  delete recipeObj.photo;
  delete recipeObj.createdAt;
  delete recipeObj.updatedAt;
  delete recipeObj.__v;

  return recipeObj;
};

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
