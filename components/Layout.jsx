import React, { useContext } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import useStyles from "../utils/styles";
import { StoreContext } from "../utils/StoreProvider";

function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(StoreContext);
  const { darkMode, cart } = state;
  const classes = useStyles();
  const handleChange = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    let newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      body: {
        fontWeight: "normal",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });

  return (
    <div>
      <Head>
        <title>{title ? `${title}-Next AmazonB` : "Next AmazonB"}</title>
        {description ? (
          <meta name="description" content={description} />
        ) : (
          <meta name="description" content="Generated by create next app" />
        )}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position={"static"} className={classes.navbar}>
          <Toolbar>
            <NextLink href={"/"} passHref={true}>
              <Link>
                <Typography className={classes.brand}>AmazonB</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow} />
            <Switch
              onChange={handleChange}
              checked={darkMode}
              // inputProps={{ "aria-label": "secondary" }}
            />
            <NextLink href={"/cart"} passHref={true}>
              <Link>
                <Typography>
                  {cart.cartItems.length > 0 ? (
                    <Badge color={"secondary"} badgeContent={cart.cartItems.length}>Cart</Badge>
                  ) : (
                    "Cart"
                  )}
                </Typography>
              </Link>
            </NextLink>
            <NextLink href={"/login"} passHref={true}>
              <Link>
                <Typography>Login</Typography>
              </Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          All rights reserved by next amazonb.
        </footer>
      </ThemeProvider>
    </div>
  );
}

export default Layout;
