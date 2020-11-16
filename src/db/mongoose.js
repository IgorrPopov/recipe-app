const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/recipe-app-api', {
  autoIndex: true, // makes email unique
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
