const { validationErrorResponse } = require("../responses/errorResponse");

const userSignupValidation = (requestBody, res) => {
  const { name, email, password } = requestBody;

  if (name.trim().length < 3) {
    return res
      .status(422)
      .json(
        validationErrorResponse("Name should be of at least 3 characters.")
      );
  }

  if (!email || !email.includes("@")) {
    return res.status(422).json(validationErrorResponse("Invalid email."));
  }

  if (
    password.trim().length < 6 ||
    new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ).test(password)
  ) {
    return res
      .status(422)
      .json(
        validationErrorResponse(
          "Please enter a password with at least 8 characters and should contain at least one uppercase(A), one lowercase(e), one number(5) & one special character(@)."
        )
      );
  }
};

module.exports = {
  userSignupValidation,
};
