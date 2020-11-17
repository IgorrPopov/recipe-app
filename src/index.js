const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const recipeRouter = require('./routers/recipe');

const app = express();
const PORT = process.env.PORT || 5000;

//
// const multer = require('multer');
// const upload = multer({
//   dest: 'images',
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send();
// });
//

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  })
);
app.use(userRouter);
app.use(recipeRouter);

app.listen(PORT, () => {
  console.log(`Server is up on port: ${PORT}`);
});
