import Layout from "../components/Layout";
import {Grid, Link, Typography} from "@material-ui/core";
import db from "../utils/db";
import Product from "../models/Product";
import axios from "axios";
import React, {useContext} from "react";
import {StoreContext} from "../utils/StoreProvider";
import {useRouter} from "next/router";
import useStyles from "../utils/styles";
import ProductItem from "../components/ProductItem";
import Carousel from "react-material-ui-carousel";
import NextLink from "next/link";
import {Image} from "@material-ui/icons";

function Home(props) {
  const classes = useStyles();
  const {featuredProducts, topRatedProducts} = props;
  const {state, dispatch} = useContext(StoreContext);
  const router = useRouter();

  const addToCartHandler = async (product) => {
    const existingItem = state.cart.cartItems.find(
        (x) => x._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    dispatch({type: "CART_ADD_ITEM", payload: {...product, quantity}});
    router.push("/cart");
  };
  return (
      <Layout>
        <Carousel className={classes.mt1} animation={"slide"}>
          {featuredProducts.map((product) => (
              <NextLink
                  key={product._id}
                  href={`/product/${product.slug}`}
                  passHref
              >
                <Link>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                      src={product.featuredImage}
                      alt={product.name}
                      className={classes.images}
                  />
                </Link>
              </NextLink>
          ))}
        </Carousel>
        <Typography variant={"h2"}>Popular Products</Typography>
        <Grid container spacing={3}>
          {topRatedProducts.map((product) => (
              <Grid item key={product.name} md={4}>
                <ProductItem
                    addToCartHandler={addToCartHandler}
                    product={product}
                />
              </Grid>
          ))}
        </Grid>
      </Layout>
  );
}

export async function getStaticProps() {
  //getStaticProps   getServerSideProps
  await db.connect();
  const featuredProductsDocs = await Product.find({isFeatured: true}, "-reviews").lean().limit(3);
  const topRatedProductsDocs = await Product.find({}, "-reviews").lean().sort({
    rating: -1
  }).limit(6);
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}

export default Home;
// export default dynamic(() => Promise.resolve(Home), {ssr: false});
