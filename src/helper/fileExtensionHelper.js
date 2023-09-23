function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}

function removeFileExtension(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

module.exports = {
  getFileExtension,
  removeFileExtension,
};
