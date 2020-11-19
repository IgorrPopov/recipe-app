const multer = require('multer');

module.exports = multer({
  limits: {
    fileSize: 1000000, // 1 mgb
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return callback(new Error('Please upload JPG, JPEG or PNG!'));
    }

    callback(undefined, true);
  },
});
