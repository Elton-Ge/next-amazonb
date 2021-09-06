import jwt from "jsonwebtoken";

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};


export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET || "something", (err, decode) => {
            if (err) {
                res.status(401).send({ message: "Invalid token" });
            } else {
                req.user = decode; //jwt.sign({payload})
                next();
            }
        });
    } else {
        res.status(401).send({ message: "No token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
       next()
    } else {
        res.status(401).send({ message: "User is not admin" });
    }
};
// export { signToken,isAuth};
