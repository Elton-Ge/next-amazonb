import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { getError } from "../../utils/error";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";
import { StoreContext } from "../../utils/StoreProvider";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminProducts() {
  const { state } = useContext(StoreContext);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;
  const [deleted, setDeleted] = useState(false);
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        // console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (deleted) {
      setDeleted(false);
    } else {
      fetchData();
    }
  }, [deleted]);

  const deleteHandler = async (pid) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      await axios.delete(`/api/admin/product/${pid}`, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setDeleted(true);
      enqueueSnackbar("Successfully Delete Profile", { variant: "success" });
    } catch (error) {
      setDeleted(false);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };
  return (
    <Layout title="Admin Dashboard">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Products" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems={"center"}>
                  <Grid item xs={12} md={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} align="right">
                    <Button
                      color="primary"
                      variant={"contained"}
                      onClick={() => router.push("/admin/product")}
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>

                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button size={"small"} variant="contained">
                                  Edit
                                </Button>
                              </NextLink>
                              <Button
                                size={"small"}
                                variant="contained"
                                onClick={() => deleteHandler(product._id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// export default ProductHistory
export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
