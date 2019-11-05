import React, { useEffect } from "react";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia
} from "@material-ui/core";
import VerifiedUserOutlined from "@material-ui/icons/VerifiedUserOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Header from "../components/Layout/header";
import { makeStyles } from "@material-ui/core/styles";
import image from "../images/sample.png";

const useStyles = makeStyles(theme => ({
  center: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "30%"
  },
  heroContent: {
    padding: theme.spacing(8, 0, 4)
  },
  marginTop: {
    marginTop: "2rem"
  }
}));

function HomePage(props) {
  const classes = useStyles();
  useEffect(() => {
    document.title = "Exercise Rec";
  }, []);
  return (
    <>
      <Header />
      <main>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          className={classes.heroContent}
        >
          Exercise Rec
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Keep exercise and record it!
        </Typography>
        <img
          class="fit-picture"
          src={image}
          alt="Grapefruit slice atop a pile of other slices"
          className={classes.center}
        />
        <Grid container justify="center">
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            component={Link}
            to="/register"
            className={classes.marginTop}
          >
            Register
          </Button>
        </Grid>
      </main>
    </>
  );
}

export default HomePage;
