import React, {useContext} from "react";
import { useRouter } from "next/router";
import {StoreContext} from "../utils/StoreProvider";

function ShippingScreen(props) {
  const router = useRouter()
  const { state, dispatch } = useContext(StoreContext);
  const {userInfo} = state;
  if (!userInfo){
    router.push("/login?redirect=shipping")
  }
  return <div>shipping</div>;
}

export default ShippingScreen;
