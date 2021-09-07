import Layout from "../components/Layout";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import NextLink from "next/link";
import db from "../utils/db";
import Product from "../models/Product";
import axios from "axios";
import React, { useContext } from "react";
import { StoreContext } from "../utils/StoreProvider";
import { useRouter } from "next/router";
import useStyles from "../utils/styles";
import Rating from "@material-ui/lab/Rating";

function Home(props) {
  const classes = useStyles();
  const { products } = props;
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();

  const addToCartHandler = async (product) => {
    const existingItem = state.cart.cartItems.find(
      (x) => x._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.name} md={4}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.image}
                      title={product.name}
                      className={classes.images}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                      <Rating value={product.rating} readOnly />
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>{product.name}</Typography>
                  <Button
                    color={"primary"}
                    size="small"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  //getStaticProps   getServerSideProps
  await db.connect();
  const products = await Product.find({}, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
// export default dynamic(() => Promise.resolve(Home), {ssr: false});
