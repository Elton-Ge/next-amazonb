import React, {useContext} from "react";
import NextLink from "next/link";
import Image from "next/image";
import Layout from "../../components/Layout";
import {
    Button,
    Card,
    Grid,
    Link,
    List,
    ListItem,
    Typography,
} from "@material-ui/core";
import useStyles from "../../utils/styles";
import db from "../../utils/db";
import Product from "../../models/Product";
import {StoreContext} from "../../utils/StoreProvider";
import axios from "axios";
import {useRouter} from "next/router";

function ProductScreen(props) {
    const {state, dispatch} = useContext(StoreContext);
    const classes = useStyles();
    const router = useRouter(); //next/router
    // const { slug } = router.query;
    // const product = data.products.find((x) => x.slug === slug);
    const {product} = props;
    if (!product) {
        return <div>Product Not Found</div>;
    }
    const addToCartHandler = async () => {
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
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href={"/"} passHref>
                    <Link>
                        <Typography>Back to products</Typography>
                    </Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        layout={"responsive"}
                        width={640}
                        height={640}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography component={"h1"} variant={"h1"}>
                                {" "}
                                {product.name}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Category: {product.category}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Brand: {product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                Rating: {product.rating} starts ({product.numReviews} reviews)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography> Description:{product.description}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Price</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>${product.price}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Status</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            {product.countInStock > 0 ? "In stock" : "unavailable"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    color="primary"
                                    fullWidth
                                    variant="contained"
                                    onClick={addToCartHandler}
                                >
                                    Add to Cart
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}


export async function getStaticPaths() {
    await db.connect();
    const products = await Product.find({}).lean();
    await db.disconnect();
    const paths = products.map((product) => ({
        params: {slug: product.slug},
    }));
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps(context) {
    //getStaticProps   getServerSideProps
    const {params} = context;
    const {slug} = params;
    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
        },
    };
}

/*
export async function getServerSideProps(context) {
  //getStaticProps   getServerSideProps
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
*/

// Home page and main page need to SSR render since for SEO
export default ProductScreen;
// export default dynamic(() => Promise.resolve(ProductScreen), {ssr: false}); //ssg also affected, false means html generated by js instead of server.

