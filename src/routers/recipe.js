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
        .resize({ width: 720, height: 400 })
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
  let limit = parseInt(req.query.limit) || 0;

  if (limit > 10) limit = 10;

  try {
    const recipes = await Recipe.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 })
      .populate({ path: 'owner', select: 'name' });

    res.send({ recipes });
  } catch (e) {
    res.status(500).send();
  }
});

// for one user
router.get('/recipes', auth, async (req, res) => {
  let skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 0;

  if (limit > 10) limit = 10;

  try {
    const match = {};

    if (req.query.category) {
      match.category = req.query.category;
    }

    await req.user
      .populate({
        path: 'recipes',
        match,
        options: {
          limit: limit,
          skip: skip,
          sort: {
            // createdAt: 1, // descending
            createdAt: -1, //  ascending
          },
        },
      })
      .execPopulate();
    res.send(req.user.recipes);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate({
      path: 'owner',
      select: 'name',
    });

    if (!recipe) {
      return res.status(404).send();
    }

    res.send(recipe);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/recipes/:id', auth, upload.single('photo'), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'category',
    'ingredients',
    'description',
    'photo',
  ];

  if (updates.length === 0) {
    return res
      .status(400)
      .send({ error: { general: 'Update request is empty!' } });
  }

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: { general: 'Invalid updates!' } });
  }
  
  const validRecipe = isRecipeDataValid(req.body);

  if (validRecipe.error)
    return res.status(400).send({ error: validRecipe.error });

  const rawRecipe = validRecipe.recipe;

  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!recipe) {
      return res.status(404).send();
    }

    updates.forEach(update => (recipe[update] = rawRecipe[update]));

    if (req.file && req.file.buffer) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 720, height: 400 })
        .jpeg()
        .toBuffer();

      recipe.photo = buffer;
    }

    await recipe.save();

    res.send(recipe);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/recipes/:id', auth, async (req, res) => {
  try {
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

router.get('/recipes/search/:input', async (req, res) => {
  const input = req.params.input || '';

  if (!input.trim()) {
    return res.status(400).send();
  }

  try {
    const recipes = await Recipe.find({
      $or: [{ $text: { $search: input } }],
    }).populate({
      path: 'owner',
      select: 'name',
    });

    res.send({ recipes });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
