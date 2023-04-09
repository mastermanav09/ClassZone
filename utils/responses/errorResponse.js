const notFoundErrorResponse = (message) => {
  return {
    status: 404,
    message: message || "not found",
  };
};

const badRequestErrorResponse = (message) => {
  return {
    status: 400,
    message: message || "bad request",
  };
};

module.exports = {
  notFoundErrorResponse,
  badRequestErrorResponse,
};
