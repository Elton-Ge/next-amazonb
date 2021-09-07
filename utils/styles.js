import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#fff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: "85vh",
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
  },
  section: {
    margin: "10px auto",
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#fff",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  fullWidth: {
    width: "100%",
  },
  images: {
    // fix ratio
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
});

export default useStyles;
