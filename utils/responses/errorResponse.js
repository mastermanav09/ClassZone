const badRequestResponse = (message) => {
  return {
    status: 400,
    message: message || "Bad request",
  };
};

const serverErrorResponse = (message) => {
  return {
    status: 500,
    message: message || "Something went wrong! Please try again later.",
  };
};

const notFoundErrorResponse = (message) => {
  return {
    status: 404,
    message: message || "Not found",
  };
};

const unauthorizedErrorResponse = (message) => {
  return {
    status: 401,
    message: message || "Unauthorized!",
  };
};

const validationErrorResponse = (message) => {
  return {
    status: 422,
    message: message || "Validation error",
  };
};

module.exports = {
  notFoundErrorResponse,
  unauthorizedErrorResponse,
  serverErrorResponse,
  validationErrorResponse,
  badRequestResponse,
};
