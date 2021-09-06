import axios from "axios";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import NextLink from "next/link";
import React, {useContext, useEffect} from "react";
import {
    Button,
    Card,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@material-ui/core";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import {StoreContext} from "../utils/StoreProvider";
import {Controller, useForm} from "react-hook-form";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";
import {getError} from "../utils/error";

function Profile() {
    const {state, dispatch} = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const {userInfo} = state;
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm();

    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
            return;
        }
        setValue("email", userInfo.email);
        setValue("name", userInfo.name);
    }, []);

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const submitHandler = async ({name, email, password, confirmPassword}) => {
        closeSnackbar();
        if (password !== confirmPassword) {
            enqueueSnackbar("password and confirmPassword are not match", {
                variant: "error",
            });
            return;
        }
        try {
            const {data} = await axios.put(
                "/api/users/profile",
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({type: "USER_LOGIN", payload: data});
            Cookies.set("userInfo", JSON.stringify(data));
            // console.log(data);
            enqueueSnackbar("Successfully Updated Profile", {variant: "success"});
        } catch (error) {
            enqueueSnackbar(getError(error), {variant: "error"});
        }
    };

    return (
        <Layout title="Profile">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/profile" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="User Profile"/>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/order-history" passHref>
                                <ListItem  button component="a">
                                    <ListItemText primary="Order History"/>
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
                                    Profile
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
                                                    minLength: 2,
                                                }}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        variant={"outlined"}
                                                        id="name"
                                                        label="Name"
                                                        inputProps={{type: "name"}}
                                                        error={Boolean(errors.name)}
                                                        helperText={
                                                            errors.name
                                                                ? errors.name.type === "minLength"
                                                                    ? "Name is not valid"
                                                                    : "Name is required"
                                                                : ""
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>

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
                                                    validate: (value) =>
                                                        value === "" ||
                                                        value.length >= 4 ||
                                                        "Password length must be more than 3",
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
                                                                ? "Password length must be more than 3"
                                                                : ""
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name={"confirmPassword"}
                                                control={control}
                                                defaultValue={""}
                                                rules={{
                                                    validate: (value) =>
                                                        value === "" ||
                                                        value.length >=4 ||
                                                        "Password length must be more than 3",
                                                }}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        variant={"outlined"}
                                                        id="confirmPassword"
                                                        label="Confirm Password"
                                                        inputProps={{type: "password"}}
                                                        error={Boolean(errors.confirmPassword)}
                                                        helperText={
                                                            errors.confirmPassword
                                                                ? "Password length must be more than 3"
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

// export default OrderHistory
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
