import React, { useContext, useEffect } from "react";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import useStyles from "../../utils/styles";
import CheckoutWizard from "../../components/CheckoutWizard";
// import { getError } from '../utils/error';
import { StoreContext } from "../../utils/StoreProvider";
import db from "../../utils/db";
import Order from "../../models/Order";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import dynamic from "next/dynamic";

function OrderScreen({ order }) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const classes = useStyles();
  const router = useRouter();
  // console.log(router.query)
  const { state, dispatch } = useContext(StoreContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    userInfo,
    cart: { successPay },
  } = state;
  const {
    orderItems: cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    totalPrice,
    taxPrice,
    shippingPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    successDelivered,
    loadingDelivered,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    // closeSnackbar();
    if (successPay) {
      dispatch({ type: "PAY_RESET" });
      // router.replace(router.asPath); //refresh data based on getServerSideProps
    }
    if (successDelivered) {
      dispatch({ type: "DELIVERED_RESET" });
      // router.replace(router.asPath); //refresh data based on getServerSideProps
    }
    const loadPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/keys/paypal", {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": clientId,
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: "pending",
      });
    };
    loadPayPalScript();
  }, [successPay, successDelivered]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Order is paid", { variant: "success" });

        router.replace(router.asPath); //refresh data based on getServerSideProps
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: "error" });
  }

  const deliveredHandler = async () => {
    try {
      dispatch({ type: "DELIVERED_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/delivered`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVERED_SUCCESS", payload: data });
      enqueueSnackbar("Order is delivered", { variant: "success" });
      router.replace(router.asPath); //refresh data
    } catch (err) {
      dispatch({ type: "DELIVERED_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Order {order._id}
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </ListItem>
              <ListItem>
                Status:{" "}
                {isDelivered ? `Delivered At ${deliveredAt}` : " Not Delivered"}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                Status: {isPaid ? `Paid At ${paidAt}` : " Not Paid"}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {!isPaid && (
                <ListItem>
                  {isPending ? (
                    <CircularProgress />
                  ) : (
                    <div className={classes.fullWidth}>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </ListItem>
              )}
              {isPaid && !isDelivered && userInfo.isAdmin && (
                <ListItem>
                  {loadingDelivered ? (
                    <CircularProgress />
                  ) : (
                    <div className={classes.fullWidth}>
                      <Button
                        color="primary"
                        fullWidth
                        type="button"
                        variant="contained"
                        onClick={deliveredHandler}
                      >
                        Delivery Order
                      </Button>
                    </div>
                  )}
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// export async function getServerSideProps({params}) {
//     return {props: {params}};
// }

export async function getServerSideProps(context) {
  //getStaticProps   getServerSideProps
  const { params } = context;
  const { id } = params;
  await db.connect();
  const order = await Order.findById(id).lean();
  await db.disconnect();
  return {
    props: {
      order: db.convertOrderDocToObj(order),
    },
  };
}

// export default OrderScreen
export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
