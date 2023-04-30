const successResponse = (message) => {
  return {
    status: 200,
    message: message || "Successfully done",
  };
};

const successResourceCreatedResponse = (message) => {
  return {
    status: 201,
    message: message || "Successfully created the resource",
  };
};

module.exports = {
  successResponse,
  successResourceCreatedResponse,
};
