import jwt from "jsonwebtoken";

export const verifyTokenOptional = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // No token, proceed without setting userId
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      // Invalid token, proceed without setting userId
      return next();
    }
    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;
    next();
  });
};
