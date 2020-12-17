const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipe');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 25,
      validate(value) {
        if (!value.match(/^[\w -]{2,25}$/)) {
          throw new Error(
            'Name must contain only English letters, numbers, hyphens, spaces, underscores and be from 2 to 25 characters!'
          );
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"!');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'owner',
});

// Methods are accessible on the instance of a model (user.method)
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismyrecipeapp');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.isPasswordValid = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);

  return isMatch;
};

// .toJSON method is used when (res.send(stringify))
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;
  // delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.avatar;

  return userObject;
};

// Statics methods are accessible on the Model (User.method)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login!');
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  // 'this' is a document (user)
  const user = this;
  // it's true if user has been created and if the password was changed
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre('remove', async function (next) {
  const user = this;

  await Recipe.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
