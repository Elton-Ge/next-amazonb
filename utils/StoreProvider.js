import React, { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const StoreContext = createContext({});
const initialState = {
  darkMode: Cookies.get("darkMode") === "ON",
  cart: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [],
    shippingAddress: Cookies.get("shippingAddress")
      ? JSON.parse(Cookies.get("shippingAddress"))
      : {},
    paymentMethod: Cookies.get("paymentMethod")
      ? Cookies.get("paymentMethod")
      : "",
  },
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item._id === newItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case "PAY_REQUEST":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingPay: true,
        },
      };
    case "PAY_SUCCESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingPay: false,
          successPay: true,
          //pay order is not necessary for this case since we get refresh data from router.replace(router.asPath) , instead of useReduce
          order: action.payload,
        },
      };
    case "PAY_FAIL":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingPay: false,
          error: action.payload,
        },
      };
    case "PAY_RESET":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingPay: false,
          successPay: false,
          error: "",
        },
      };
    case "DELIVERED_REQUEST":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingDelivered: true,
        },
      };
    case "DELIVERED_SUCCESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingDelivered: false,
          successDelivered: true,
          //pay order is not necessary for this case since we get refresh data from router.replace(router.asPath) , instead of useReduce
          order: action.payload,
        },
      };
    case "DELIVERED_FAIL":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingDelivered: false,
          error: action.payload,
        },
      };
    case "DELIVERED_RESET":
      return {
        ...state,
        cart: {
          ...state.cart,
          loadingDelivered: false,
          successDelivered: false,
          error: "",
        },
      };
    case "USER_LOGIN":
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };
    default:
      return state;
  }
};

function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

export default StoreProvider;
