import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAuth } from "../../../utils/auth";

const handler = nc({ onError });
handler.use(isAuth);
handler.get(async (req, res) => {
    await db.connect();
    const orders=await Order.find({user: req.user._id})
    console.log(orders)
    // console.log(order)
    res.send(orders);
});

export default handler;
