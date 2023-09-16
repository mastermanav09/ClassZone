function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}

module.exports = {
  getFileExtension,
};
