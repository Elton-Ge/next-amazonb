import nc from "next-connect";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Product from "../../../../models/Product";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.post(async (req, res) => {
  await db.connect();
  const product = new Product({
    name: req.body.name,
    slug: req.body.slug,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    brand: req.body.brand,
    countInStock: req.body.countInStock,
    description: req.body.description,
  });

  const newProduct = await product.save();
  await db.disconnect();
  res.send({ newProduct, message: "Product updated successfully" });
});

export default handler;
