const express = require('express');

const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('./utils/multerSetUp');

const isUserDataValid = require('./utils/isUserDataValid');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const validUserData = isUserDataValid(req.body, {
    name: true,
    email: true,
    password: true,
  });

  if (!validUserData.isValid) {
    return res.status(400).send({ error: validUserData.error });
  }

  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
      return res
        .status(400)
        .send({ error: { email: 'Email is already taken!' } });
    }

    res.status(400).send(e.toString());
  }
});

router.post('/users/login', async (req, res) => {
  try {
    // .findByCredentials is a custom method from model
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: { general: 'Unable to login' } });
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// router.get('/users', auth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedData = ['name', 'email', 'password'];

  const isUpdatesAllowed = updates.every(update =>
    allowedData.includes(update)
  );

  if (!isUpdatesAllowed) {
    return res.status(400).send({ error: { general: 'Request is invalid!' } });
  }

  const opt = updates.reduce((obj, update) => ((obj[update] = true), obj), {});

  const validUserData = isUserDataValid(req.body, opt);

  if (!validUserData.isValid) {
    return res.status(400).send({ error: validUserData.error });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
      return res
        .status(400)
        .send({ error: { email: 'Email is already taken!' } });
    }

    res.status(500).send(e.toString());
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .jpeg()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  req.user.save();
  res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
