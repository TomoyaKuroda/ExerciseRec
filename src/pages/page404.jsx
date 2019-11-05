import React from "react";
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
import { withRouter } from "react-router-dom";

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

const Page404 = props => {
  props.history.replace("/");
  return <></>;
};

export default withRouter(Page404);
