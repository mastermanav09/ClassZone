const colorValidator = (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v);

module.exports = {
  colorValidator,
};
