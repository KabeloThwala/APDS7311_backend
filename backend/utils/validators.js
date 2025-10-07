const Joi = require("joi");

// South African ID validation (13 digits)
const saIDPattern = /^[0-9]{13}$/;

exports.registerValidator = data => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    idNumber: Joi.string().pattern(saIDPattern).required().messages({
      "string.pattern.base": "Invalid SA ID number"
    }),
    password: Joi.string().min(8).max(50).required(),
    role: Joi.string().valid("customer", "staff")
  });
  return schema.validate(data);
};

exports.loginValidator = data => {
  const schema = Joi.object({
    accountNumber: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

exports.paymentValidator = data => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().required(),
    provider: Joi.string().required(),
    payeeAccount: Joi.string().required(),
    swiftCode: Joi.string().required()
  });
  return schema.validate(data);
};
