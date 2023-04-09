const successResponse = (statusCode, message) => {
  return {
    status: statusCode,
    message,
  };
};

module.exports = {
  successResponse,
};
