import nc from "next-connect";
import db from "../../../../../utils/db";
import { onError } from "../../../../../utils/error";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import Product from "../../../../../models/Product";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.featuredImage = req.body.featuredImage;
    product.isFeatured = req.body.isFeatured;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const newProduct = await product.save();
    await db.disconnect();
    res.send({ newProduct, message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
});
handler.delete(async (req, res) => {
  await db.connect();
  await Product.deleteOne({ _id: req.query.id });
  res.send({ message: "Product delete successfully" });
});
export default handler;
