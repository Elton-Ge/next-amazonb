import nc from "next-connect";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.post(async (req, res) => {
  await db.connect();
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    isAdmin: req.body.isAdmin,
  });

  const newUser = await user.save();
  await db.disconnect();
  res.send({ newUser, message: "User updated successfully" });
});

export default handler;
