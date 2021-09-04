import React, {useContext, useEffect} from "react";
import Layout from "../components/Layout";
import {
    Button,
    Link,
    List,
    ListItem,
    TextField,
    Typography,
} from "@material-ui/core";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import {StoreContext} from "../utils/StoreProvider";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {Controller, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";

function LoginScreen(props) {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const {redirect} = router.query; //login?redirect=shipping
    const {state, dispatch} = useContext(StoreContext);
    const {userInfo} = state;
    useEffect(() => {
        if (userInfo) {
            router.push("/");
        }
    }, []);
    // if (userInfo){
    //   router.push("/")
    // }
    const classes = useStyles();
    const submitHandler = async ({email, password}) => {
        closeSnackbar();
        try {
            const {data} = await axios.post("/api/users/login", {
                email,
                password,
            });
            dispatch({type: "USER_LOGIN", payload: data});
            Cookies.set("userInfo", JSON.stringify(data));
            router.push(redirect || "/");
            // console.log(data);
        } catch (error) {
            enqueueSnackbar(
                error.response.data ? error.response.data.message : error.message,
                {variant: "error"}
            );
        }
    };
    return (
        <Layout title={"Login"}>
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography variant={"h1"}>Login</Typography>
                <List>
                    <ListItem>
                        <Controller
                            name={"email"}
                            control={control}
                            defaultValue={""}
                            rules={{
                                required: true,
                                pattern:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            }}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    variant={"outlined"}
                                    id="email"
                                    label="Email"
                                    inputProps={{type: "email"}}
                                    error={Boolean(errors.email)}
                                    helperText={
                                        errors.email
                                            ? errors.email.type === "pattern"
                                                ? "Email is not valid"
                                                : "Email is required"
                                            : ""
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name={"password"}
                            control={control}
                            defaultValue={""}
                            rules={{
                                required: true,
                                minLength: 4,
                            }}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    variant={"outlined"}
                                    id="password"
                                    label="Password"
                                    inputProps={{type: "password"}}
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password
                                            ? errors.password.type === "minLength"
                                                ? "Password length is more than 3"
                                                : "Password is required"
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
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Don't have an account? &nbsp;
                        <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
                            <Link>Register</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}

export default LoginScreen;
