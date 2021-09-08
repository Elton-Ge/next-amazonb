import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
    margin: 20,
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
  reviewForm: {
    width: "100%",
    maxWidth: 800,
  },
  reviewItem: {
    marginRight: 16,
    borderRight: "1px solid #ccc",
    paddingRight: 16,
  },
  searchSection: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  searchForm: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 10,
  },
  searchInput: {
    paddingLeft: 5,
    color: "#000",
    "& ::placeholder": {
      color: "#606060",
    },
  },
  iconButton: {
    backgroundColor: "#f8c040",
    padding: 5,
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#000",
    },
    "&:hover": {
      backgroundColor: "#fad27c",
    },
  },
  sort: {
    marginRight: 5,
  },
  mt1: { marginTop: "1rem" },
}));

export default useStyles;
