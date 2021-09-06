import React, { useContext, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import useStyles from "../utils/styles";
import { StoreContext } from "../utils/StoreProvider";
import { useRouter } from "next/router";

function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const { darkMode, cart, userInfo } = state;
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
      body1: {
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
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
 const loginMenuCloseHandler = () =>{
   setAnchorEl(null);
 }
  const menuRedirectHandler = (e,redirect) => {
    setAnchorEl(null);
    if (redirect){
      router.push(redirect)
    }
  };


  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

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
                    <Badge
                      color={"secondary"}
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Typography>
              </Link>
            </NextLink>
            {userInfo ? (
              <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                  className={classes.navbarButton}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem onClick={(e)=>menuRedirectHandler(e,"/profile")}>Profile</MenuItem>
                  <MenuItem onClick={(e)=>menuRedirectHandler(e,"/order-history")}>
                    Order History
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href={"/login"} passHref={true}>
                <Link>
                  <Typography>Login</Typography>
                </Link>
              </NextLink>
            )}
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
