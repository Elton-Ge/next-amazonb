import nc from "next-connect";
import db from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { isAuth, signToken } from "../../../utils/auth";

const handler = nc();
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password, 8)
    : user.password;
  const newUser = await user.save();
  await db.disconnect();
  const token = signToken(newUser);
  res.send({
    token,
    _id: newUser._id,
    email: newUser.email,
    name: newUser.name,
    isAdmin: newUser.isAdmin,
  });
});

export default handler;
