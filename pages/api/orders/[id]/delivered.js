import nc from "next-connect";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Order from "../../../../models/Order";

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);
handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({ message: "Order Delivered", deliveredOrder });
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

export default handler;
