import nc from "next-connect";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";
import { isAdmin, isAuth } from "../../../utils/auth";
import User from "../../../models/User";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.get(async (req, res) => {
  await db.connect();
  const user = await User.find({});
  await db.disconnect();
  res.send(user);
});

export default handler;
