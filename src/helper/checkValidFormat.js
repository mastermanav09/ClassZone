const imageFormats = ["jpeg", "jpg", "png", "webp"];
const checkValidImageFormat = (format) => {
  return imageFormats.includes(format.toLowerCase());
};

const checkValidFileFormat = (format) => {
  return formats.includes(format.toLowerCase());
};

module.exports = {
  checkValidImageFormat,
  checkValidFileFormat,
};
