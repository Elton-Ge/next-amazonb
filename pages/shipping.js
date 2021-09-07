import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../utils/styles";
import { StoreContext } from "../utils/StoreProvider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import CheckoutWizard from "../components/CheckoutWizard";
import dynamic from "next/dynamic";

function ShippingScreen(props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    if (shippingAddress) {
      setValue("fullName", shippingAddress.fullName);
      setValue("address", shippingAddress.address);
      setValue("city", shippingAddress.city);
      setValue("postalCode", shippingAddress.postalCode);
      setValue("country", shippingAddress.country);
    }
  }, [shippingAddress]);
  // if (userInfo){
  //   router.push("/")
  // }
  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "shippingAddress",
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    router.push("/payment");
  };
  return (
    <Layout title={"Shipping Address"}>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <CheckoutWizard activeStep={1} />
        <Typography variant={"h1"}>Shipping Address</Typography>
        <List>
          <ListItem>
            <Controller
              name={"fullName"}
              control={control}
              defaultValue={""}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant={"outlined"}
                  id="fullName"
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === "minLength"
                        ? "Full Name length is more than 1"
                        : "Full Name is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={"address"}
              control={control}
              defaultValue={""}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant={"outlined"}
                  id="address"
                  label="Address"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === "minLength"
                        ? "Address length is more than 1"
                        : "Address is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={"city"}
              control={control}
              defaultValue={""}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant={"outlined"}
                  id="city"
                  label="City"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === "minLength"
                        ? "City length is more than 1"
                        : "City is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={"postalCode"}
              control={control}
              defaultValue={""}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant={"outlined"}
                  id="postalCode"
                  label="PostcalCode"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === "minLength"
                        ? "PostcalCode length is more than 1"
                        : "PostcalCode is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={"country"}
              control={control}
              defaultValue={""}
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant={"outlined"}
                  id="country"
                  label="Country"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === "minLength"
                        ? "Country length is more than 1"
                        : "Country is required"
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
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

// export default ShippingScreen;
export default dynamic(() => Promise.resolve(ShippingScreen), { ssr: false });
