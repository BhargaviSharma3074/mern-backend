import jwt from "jsonwebtoken";
const SECRET = "sometext";
const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if(!token || !token.startsWith("Bearer "))
    {
      return res.status(401).json({message: "No token provided!"});
    }
    token = token.split(" ")[1];
    const user = jwt.verify(token, SECRET);
    req.role = user.role;
    next();
  } catch (err) {
    console.log(err);
    return res.json({ message: "Invalid Token" });
  }
};
const authorize = (role) => {
  return (req, res, next) => {
    if (req.role === role) {
      next();
    } else {
      return res.json({ message: "Unauthorized access" });
    }
  };
};
export {authenticate,authorize}