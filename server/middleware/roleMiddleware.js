const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      if (
        !roles.includes(req.user.role)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission",
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

export default roleMiddleware;