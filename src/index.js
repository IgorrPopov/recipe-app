const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const recipeRouter = require('./routers/recipe');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  })
);

app.use(express.urlencoded({ extended: true })); // for multipart/form-data

app.use(userRouter);
app.use(recipeRouter);

app.listen(PORT, () => {
  console.log(`Server is up on port: ${PORT}`);
});
