import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, withRouter } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";
import firebase from "../firebase";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  bgColor: {
    backgroundColor: blue[400]
  },
  nav: {
    marginRight: theme.spacing(2)
  }
}));

function Header(props) {
  const classes = useStyles();
  const [auth, setAuth] = useState(true);
  useEffect(() => {
    const fetchAuth = async () => {
      const result = await firebase.getCurrentUsername();
      if (result) setAuth(true);
      else setAuth(false);
    };
    fetchAuth();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bgColor}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Exercise Rec
          </Typography>
          {firebase.getCurrentUsername() ? (
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              className={classes.nav}
            >
              {firebase.getCurrentUsername()}
            </Button>
          ) : null}
          {!auth ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );

  async function logout() {
    await firebase.logout();
    props.history.replace("/");
  }
}

export default withRouter(Header);
