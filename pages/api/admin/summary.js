import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import { onError } from "../../../utils/error";
import { isAdmin, isAuth } from "../../../utils/auth";
import Product from "../../../models/Product";
import User from "../../../models/User";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  // console.log(ordersPriceGroup);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  // console.log(salesData);
  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
