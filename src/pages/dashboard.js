import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import firebase from "../components/firebase";
import { Typography, Button, Avatar, Grid } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import VerifiedUserOutlined from "@material-ui/icons/VerifiedUserOutlined";
import Header from "../components/Layout/header";
import Chart from "react-apexcharts";

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
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    // display: "inline-block",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
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
      { title: "Date", field: "date", type: "date" }
    ],
    data: []
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

  //Chart
  function generateDayWiseTimeSeries(baseval, count) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (100 - 30 + 1)) + 30;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  let oneMonth=new Date()
  oneMonth.setMonth(oneMonth.getMonth()-1)

  const data = {
    options: {
      chart: {
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Bicycle Crunch by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        type: "datetime"
      }
    },
    series: [
      {
        name: "Desktops",
        data: generateDayWiseTimeSeries(oneMonth.getTime(), 30)
      }
    ]
  };

  return (
    <>
      <Header />
      <main className={classes.main}>
        <div id="chart">
          <Chart
            options={data.options}
            series={data.series}
            type="line"
            height="350"
          />
        </div>
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
              })
          }}
        />
      </main>
    </>
  );

  async function addExercise(menu, times, date) {
    let day = new Date(date);
    try {
      await firebase.addExercise({
        menu: menu,
        times: times,
        date: `${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`
      });
      await firebase.getCurrentUserExercises().then(setExercises);
    } catch (error) {
      alert(error.message);
    }
  }
}

export default withRouter(withStyles(styles)(Dashboard));
