const express = require('express');
const sharp = require('sharp');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');
const upload = require('./utils/multerSetUp');
const isRecipeDataValid = require('./utils/isRecipeDataValid');

const router = new express.Router();

// Create a recipe
router.post(
  '/recipes',
  auth,
  upload.single('photo'),
  async (req, res) => {
    const validRecipe = isRecipeDataValid(req.body);

    if (validRecipe.error)
      return res.status(400).send({ error: validRecipe.error });

    const rawRecipe = validRecipe.recipe;

    if (req.file && req.file.buffer) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 })
        .jpeg()
        .toBuffer();

      rawRecipe.photo = buffer;
    }

    const recipe = new Recipe({ ...rawRecipe, owner: req.user._id });

    try {
      await recipe.save();
      res.status(201).send(recipe);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  (error, req, res, next) => {
    // Catch error from middleware
    res.status(400).send({ error: { photo: error.message } });
  }
);

router.get('/recipesAll', async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 0;

  try {
    const recipes = await Recipe.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });
    res.send({ recipes });
  } catch (e) {
    res.status(500).send();
  }
});

// for one user
router.get('/recipes', auth, async (req, res) => {
  try {
    // const recipes = await Recipe.find({});
    // const recipes = await Recipe.find({ owner:  req.user._id });
    const match = {};

    if (req.query.category) {
      match.category = req.query.category;
    }

    await req.user
      .populate({
        path: 'recipes',
        match,
        options: {
          limit: 0,
          skip: 0,
          sort: {
            createdAt: 1, // descending
            // createdAt: -1 //  ascending
          },
        },
      })
      .execPopulate();
    res.send(req.user.recipes);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/recipes/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const recipe = await Recipe.findById(req.params.id);

    const recipe = await Recipe.findOne({ _id, owner: req.user._id });

    if (!recipe) {
      return res.status(404).send();
    }

    res.send(recipe);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/recipes/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'category', 'ingredients', 'description'];

  if (updates.length === 0) {
    return res.status(400).send({ error: 'Update request is empty!' });
  }

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!recipe) {
      return res.status(404).send();
    }

    updates.forEach(update => (recipe[update] = req.body[update]));

    await recipe.save();

    // const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(recipe);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/recipes/:id', auth, async (req, res) => {
  try {
    // const recipe = await Recipe.findByIdAndDelete(req.params.id);

    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!recipe) {
      return res.status(404).send();
    }

    res.send(recipe);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/recipes/:id/photo', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe || !recipe.photo) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(recipe.photo);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
