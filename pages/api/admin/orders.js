import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAdmin, isAuth } from "../../../utils/auth";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({}).populate("user", ["name", "email"]);
  console.log(orders);
  await db.disconnect();
  res.send(orders);
});

export default handler;
