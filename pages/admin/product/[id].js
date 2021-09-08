import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import Layout from "../../../components/Layout";
import useStyles from "../../../utils/styles";
import { StoreContext } from "../../../utils/StoreProvider";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getError } from "../../../utils/error";
import Product from "../../../models/Product";
import db from "../../../utils/db";

function ProductEdit({ product }) {
  const { state } = useContext(StoreContext);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loadingUpload, setLoadingUpload] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    setValue("name", product.name);
    setValue("slug", product.slug);
    setValue("price", product.price);
    setValue("image", product.image);
    setIsFeatured(product.isFeatured);
    setValue("featuredImage", product.featuredImage);
    setValue("category", product.category);
    setValue("brand", product.brand);
    setValue("countInStock", product.countInStock);
    setValue("description", product.description);
  }, []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const uploadHandler = async (e, imageField = "image") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      // dispatch({ type: 'UPLOAD_REQUEST' });
      setLoadingUpload(true);
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      // dispatch({ type: 'UPLOAD_SUCCESS' });
      setLoadingUpload(false);
      // console.log(data)
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      setLoadingUpload(false);
      // dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    image,
    category,
    brand,
    countInStock,
    description,
    featuredImage,
  }) => {
    closeSnackbar();
    try {
      await axios.put(
        `/api/admin/product/${product._id}`,
        {
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
          isFeatured,
          featuredImage,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      // dispatch({type: "USER_LOGIN", payload: data});
      // Cookies.set("userInfo", JSON.stringify(data));
      // console.log(data);
      enqueueSnackbar("Successfully Updated Profile", { variant: "success" });
      router.push("/admin/products");
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };
  const [isFeatured, setIsFeatured] = useState(false);
  return (
    <Layout title="Profile">
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
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Edit Product {product._id}
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name={"name"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"slug"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"price"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? "Price is required" : ""}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"image"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="image"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? "Image is required" : ""}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Button variant={"contained"} component="label">
                        Upload File
                        <input type="file" hidden onChange={uploadHandler} />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label={"is Featured"}
                        control={
                          <Checkbox
                            onClick={(e) => setIsFeatured(e.target.checked)}
                            checked={isFeatured}
                            name={"isFeatured"}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"featuredImage"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="featuredImage"
                            label="Featured Image"
                            error={Boolean(errors.image)}
                            helperText={
                              errors.image ? "Featured Image is required" : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Button variant={"contained"} component="label">
                        Upload File
                        <input
                          type="file"
                          hidden
                          onChange={(e) => uploadHandler(e, "featuredImage")}
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"category"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? "Category is required" : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"brand"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="brand"
                            label="Brand"
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? "Brand is required" : ""}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"countInStock"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            id="countInStock"
                            label="CountInStock"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? "CountInStock is required"
                                : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name={"description"}
                        control={control}
                        defaultValue={""}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            variant={"outlined"}
                            multiline
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? "Description is required"
                                : ""
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>

                    <ListItem>
                      <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        variant={"contained"}
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  //getStaticProps   getServerSideProps
  const { params } = context;
  const { id } = params;
  await db.connect();
  const product = await Product.findById(id).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

// export default OrderHistory
export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
