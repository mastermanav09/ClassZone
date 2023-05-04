const Joi = require("joi");

const userSignupValidation = (requestBody) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).required().messages({
      "any.required": `Name is a required field`,
      "string.empty": `Name cannot be an empty field`,
      "string.min": `Name should have a minimum length of 3`,
    }),

    email: Joi.string().email().required().messages({
      "string.base": `Please enter a valid email.`,
      "any.required": `Email is a required field`,
      "string.empty": `Email cannot be an empty field`,
    }),

    password: Joi.string()
      .min(8)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .required()
      .messages({
        "string.pattern.base": `Please enter a password with at least 8 characters and should contain at least one letter, one number & one special character.`,
        "string.min": `Password should have a minimum length of 8`,
        "any.required": `Password is a required field`,
        "string.empty": `Password cannot be an empty field`,
      }),
  });

  return schema.validate(requestBody);
};

module.exports = {
  userSignupValidation,
};
