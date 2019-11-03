import React, { useState, useEffect } from "react";
import "./styles.css";
import HomePage from "../../pages/home";
import Login from "../../pages/login";
import Register from "../../pages/register";
import Dashboard from "../../pages/dashboard";
import Page404 from '../../pages/page404'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "../firebase";

const theme = createMuiTheme();

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val);
    });
  });

  return firebaseInitialized !== false ? (
    <>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route component={Page404} />
        </Switch>
      </Router>
    </>
  ) : (
    <div id="loader">
      <CircularProgress />
    </div>
  );
}
