const Joi = require("joi");

const createAssignmentValidation = (requestBody) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).required().messages({
      "any.required": `Title is a required field`,
      "string.empty": `Title cannot be an empty field`,
      "string.min": `Title should have a minimum length of 3`,
    }),

    description: Joi.string().trim().min(5).required().messages({
      "string.min": `Description should have a minimum length of 5`,
      "any.required": `Description is a required field`,
      "string.empty": `Description cannot be an empty field`,
    }),

    dueDate: Joi.date().min(new Date()).message("Please enter valid date."),
  });

  return schema.validate(requestBody);
};

module.exports = {
  createAssignmentValidation,
};
