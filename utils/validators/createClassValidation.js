const Joi = require("joi");

const createClassValidation = (requestBody) => {
  const schema = Joi.object({
    className: Joi.string().trim().min(5).required().messages({
      "any.required": `ClassName is a required field`,
      "string.empty": `ClassName cannot be an empty field`,
      "string.min": `ClassName should have a minimum length of 5`,
    }),

    subject: Joi.string().trim().min(3).required().messages({
      "string.min": `Subject should have a minimum length of 3`,
      "any.required": `Subject is a required field`,
      "string.empty": `Subject cannot be an empty field`,
    }),

    batch: Joi.string().trim().min(3).required().messages({
      "string.min": `Subject should have a minimum length of 3`,
      "any.required": `Batch is a required field`,
      "string.empty": `Batch cannot be an empty field`,
    }),
  });

  return schema.validate(requestBody);
};

module.exports = {
  createClassValidation,
};
