import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import { getError } from "../utils/error";
import axios from "axios";
import { useSnackbar } from "notistack";

function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const { darkMode, cart, userInfo } = state;
  const classes = useStyles();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");

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
  const { enqueueSnackbar } = useSnackbar();

  const loginClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };
  const menuRedirectHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/products/categories");
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const sidebarOpenHandler = async () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
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
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={sidebarOpenHandler}
            >
              <MenuIcon className={classes.navbarButton} />
            </IconButton>
            <NextLink href={"/"} passHref={true}>
              <Link>
                <Typography className={classes.brand}>AmazonB</Typography>
              </Link>
            </NextLink>
            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Typography variant={"h2"}>Categories</Typography>
                  <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                    <CancelIcon />
                  </IconButton>
                </ListItem>
                <Divider />
                {categories.map((category, index) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem button onClick={sidebarCloseHandler}>
                      <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={category} />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.grow} />

            <div className={classes.searchSection}>
              <form onSubmit={submitHandler} className={classes.searchForm}>
                <InputBase
                  name="query"
                  className={classes.searchInput}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </div>
            <Switch
              onChange={handleChange}
              checked={darkMode}
              // inputProps={{ "aria-label": "secondary" }}
            />
            <NextLink href={"/cart"} passHref={true}>
              <Link>
                <Typography component={"span"}>
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
                  <MenuItem onClick={(e) => menuRedirectHandler(e, "/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => menuRedirectHandler(e, "/order-history")}
                  >
                    Order History
                  </MenuItem>
                  {userInfo.isAdmin && (
                    <MenuItem
                      onClick={(e) =>
                        menuRedirectHandler(e, "/admin/dashboard")
                      }
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href={"/login"} passHref={true}>
                <Link>
                  <Typography component={"span"}>Login</Typography>
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
