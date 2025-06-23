//TODO validation of USer auth create a middleware for authenticating user to access api and then refactoring jwt and bcrypt inside user.js(UserSchema)

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter the Name please");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFIelds = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFIelds.includes(field)
  );
  //return a boolean
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
