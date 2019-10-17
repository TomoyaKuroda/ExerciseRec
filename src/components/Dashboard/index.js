import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import firebase from "../firebase";
import { Typography, Button, Avatar, Grid } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import VerifiedUserOutlined from "@material-ui/icons/VerifiedUserOutlined";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      // width: 400,
      width: "auto",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    // display: "inline-block",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function Dashboard(props) {
  const { classes } = props;

  if (!firebase.getCurrentUsername()) {
    // not logged in
    alert("Please login first");
    props.history.replace("/login");
    return null;
  }

  const [exercises, setExercises] = useState([]);

  const [state, setState] = React.useState({
    columns: [
      { title: "Menu", field: "menu" },
      { title: "Times", field: "times", type: "numeric" },
      { title: "Date", field: "date", type: "date" },
    ],
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await firebase.getCurrentUserExercises();
      console.log(result);
      setState({ ...state, data: result });
      console.log(state.data);
    };
    fetchData();
  }, []);

  return (
    <main className={classes.main}>
      <Grid container justify="center">
        <Avatar className={classes.avatar}>
          <VerifiedUserOutlined />
        </Avatar>
      </Grid>

      <Typography
        component="h1"
        variant="h5"
        className="MuiTypography-alignCenter"
      >
        Hello {firebase.getCurrentUsername()}
      </Typography>
      <MaterialTable
        title="Exercise Record"
        columns={state.columns}
        data={state.data}
        // style={{ boxShadow: "initial" }} //added
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                addExercise(newData.menu, newData.times, newData.date);
                console.log(newData);
                const data = [...state.data];
                data.push(newData);
                setState({ ...state, data });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...state.data];
                data[data.indexOf(oldData)] = newData;
                setState({ ...state, data });
                firebase.updateExercise(newData);
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...state.data];
                data.splice(data.indexOf(oldData), 1);
                setState({ ...state, data });
                firebase.deleteExercise(oldData);
              }, 600);
            }),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={logout}
        className={classes.submit}
      >
        Logout
      </Button>
    </main>
  );

  async function addExercise(menu, times, date) {
    let day = new Date(date);
    try {
      await firebase.addExercise({
        menu: menu,
        times: times,
        date: `${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`,
      });
      await firebase.getCurrentUserExercises().then(setExercises);
    } catch (error) {
      alert(error.message);
    }
  }

  async function logout() {
    await firebase.logout();
    props.history.push("/");
  }
}

export default withRouter(withStyles(styles)(Dashboard));
