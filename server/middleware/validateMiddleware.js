const validateMiddleware = (
  requiredFields
) => {
  return (req, res, next) => {
    try {
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing fields: ${missingFields.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default validateMiddleware;