const express = require('express');
const sharp = require('sharp');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');
const router = new express.Router();
const upload = require('./utils/multerSetUp');

router.post('/recipes', auth, async (req, res) => {
  // const recipe = new Recipe(req.body);

  const recipe = new Recipe({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await recipe.save();
    res.status(201).send(recipe);
  } catch (e) {
    res.status(400).send(e);
  }
});

// -----------------

router.post(
  '/recipesIMG',
  auth,
  upload.single('photo'),
  async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    const rawRecipe = req.body;
    rawRecipe.ingredients = rawRecipe.ingredients
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ');

    rawRecipe.photo = buffer;

    const recipe = new Recipe({ ...rawRecipe, owner: req.user._id });

    try {
      await recipe.save();
      res.status(201).send(recipe);
    } catch (e) {
      res.status(400).send(e);
      // console.log(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    console.log('Error: ', error.message);
  }
);
// -----------------

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
          limit: 2,
          skip: 1,
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

module.exports = router;
