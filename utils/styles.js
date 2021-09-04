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
    // minHeight:"10vh"
  },
  section: {
    margin: "10px auto",
  },
});

export default useStyles;
