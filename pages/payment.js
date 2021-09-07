import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../utils/StoreProvider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import useStyles from "../utils/styles";
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

function PaymentScreen() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { shippingAddress },
  } = state;
  const [paymentMethod, setPaymentMethod] = useState(
    Cookies.get("paymentMethod") || ""
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    }
  }, []);
  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
    } else {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
      Cookies.set("paymentMethod", paymentMethod);
      router.push("/placeorder");
    }
  };
  return (
    <Layout title={"Payment Method"}>
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography variant={"h1"}>Payment Method</Typography>
        <List>
          <ListItem>
            <FormControl component={"fieldset"}>
              <RadioGroup
                aria-label="Payment Method"
                name={"paymentMethod"}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="PayPal"
                  label="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="Stripe"
                  label="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="Cash"
                  label="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              color={"primary"}
              fullWidth
              variant={"contained"}
              type={"submit"}
            >
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color={"secondary"}
              fullWidth
              variant={"contained"}
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

// export default PaymentScreen;
export default dynamic(() => Promise.resolve(PaymentScreen), { ssr: false });
