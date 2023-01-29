const Joi = require("joi");

const urlSchema = Joi.object({
  urlData: Joi.array().items(Joi.string()),
});

const validateUrlSchema = function (req, res, next) {
  const { error } = urlSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(500).json({ error: error });
  } else {
    next();
  }
};

module.exports = { validateUrlSchema };
