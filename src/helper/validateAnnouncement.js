const validateAnnouncement = (content) => {
  const plainString = content.replace(/<[^>]+>/g, "");
  const updatedStr = plainString.split("&nbsp;").join("");

  if (updatedStr.trim().length === 0) {
    return false;
  }

  return true;
};

module.exports = {
  validateAnnouncement,
};
