import nc from "next-connect";
import db from "../../../../../utils/db";
import { onError } from "../../../../../utils/error";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import User from "../../../../../models/User";
import bcrypt from "bcryptjs";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password, 8)
      : user.password;
    await user.save();
    await db.disconnect();
    res.send({ message: "User updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "User not found" });
  }
});
handler.delete(async (req, res) => {
  await db.connect();
  await User.deleteOne({ _id: req.query.id });
  res.send({ message: "User delete successfully" });
});
export default handler;
