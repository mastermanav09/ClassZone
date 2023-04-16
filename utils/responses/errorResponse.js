const notFoundErrorResponse = (message) => {
  return {
    status: 404,
    message: message || "not found",
  };
};

const unauthorizedErrorResponse = (message) => {
  return {
    status: 401,
    message: message || "unauthorized!",
  };
};

const validationErrorResponse = (message) => {
  return {
    status: 422,
    message: message || "validation error",
  };
};

module.exports = {
  notFoundErrorResponse,
  unauthorizedErrorResponse,
  validationErrorResponse,
};
