const express = require('express');
const sharp = require('sharp');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');
const upload = require('./utils/multerSetUp');
const isRecipeDataValid = require('./utils/isRecipeDataValid');
const { title } = require('process');

const router = new express.Router();

const imgNameArr = [];

// Create a recipe
router.post(
  '/recipes',
  auth,
  upload.single('photo'),
  async (req, res) => {
    // --------------
    // console.log('post');
    const fs = require('fs');
    const fetch = require('node-fetch');

    async function downloadRandomImg() {
      const apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';

      const response = await fetch(apiUrl);

      const apiRecipeObj = await response.json();

      const {
        strMeal: title,
        strCategory: category,
        strInstructions: description,
        strMealThumb: imgUrl,
      } = apiRecipeObj.meals[0];

      // prevent repeating recepis
      if (imgNameArr.includes(imgUrl)) return 'Dublicat';
      imgNameArr.push(imgUrl);

      // parse ingredients
      let ingredients = '';

      for (let i = 1; i <= 20; i++) {
        const ingredient = apiRecipeObj.meals[0][`strIngredient${i}`];
        if (ingredient !== '') ingredients += '\n' + ingredient;
      }

      let rawRecipe = { title, category, description, ingredients };

      const validRecipeData = isRecipeDataValid(rawRecipe);
      if (validRecipeData.error) return 'Invalid Recipe';

      const validRecipe = validRecipeData.recipe;

      // img
      const imgResponse = await fetch(imgUrl);

      if (imgResponse.status !== 200) return 'No img';

      let buffer = await imgResponse.buffer();

      buffer = await sharp(buffer)
        .resize({ width: 720, height: 400 })
        .jpeg()
        .toBuffer();

      validRecipe.photo = buffer;

      try {
        const recipe = new Recipe({ ...validRecipe, owner: req.user._id });
        await recipe.save();
        return `Recipe: "${title}" loaded!`;
      } catch (e) {
        return 'Error: ' + e.message;
      }
    }

    while (imgNameArr.length < 100) {
      console.log(await downloadRandomImg());
    }

    res.send(imgNameArr);
    // ----------------
    return;
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

  // if (skip > 10) skip = 10;
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

// router.get('/recipes/:id', auth, async (req, res) => {
//   const _id = req.params.id;

//   try {
//     // const recipe = await Recipe.findById(req.params.id);

//     const recipe = await Recipe.findOne({ _id, owner: req.user._id });

//     if (!recipe) {
//       return res.status(404).send();
//     }

//     res.send(recipe);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

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
    console.log(e);
    res.status(500).send();
  }
});

// router.post(
//   '/recipes',
//   auth,
//   upload.single('photo'),
//   async (req, res) => {
//     const validRecipe = isRecipeDataValid(req.body);

//     if (validRecipe.error)
//       return res.status(400).send({ error: validRecipe.error });

//     const rawRecipe = validRecipe.recipe;

//     if (req.file && req.file.buffer) {
//       const buffer = await sharp(req.file.buffer)
//         .resize({ width: 720, height: 400 })
//         .jpeg()
//         .toBuffer();

//       rawRecipe.photo = buffer;
//     }

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
  // ----------------------
  const validRecipe = isRecipeDataValid(req.body);

  if (validRecipe.error)
    return res.status(400).send({ error: validRecipe.error });

  const rawRecipe = validRecipe.recipe;

  // console.log('validRecipe.recipe: ', validRecipe.recipe);
  // console.log('updates: ', updates);
  // // -------------------
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

    console.log(recipe);

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

router.get('/recipes/search/:input', async (req, res) => {
  const input = req.params.input || '';
  console.log(input);

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
