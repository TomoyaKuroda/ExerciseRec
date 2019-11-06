import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import firebase from "../components/firebase";
import { Typography, Button, Avatar, Grid } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
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

  const [tableData, setTableData] = React.useState([{menu:'',times:0, date:''}]);

  let columns = [
    { title: "Menu", field: "menu" },
    { title: "Times", field: "times", type: "numeric" },
    { title: "Date", field: "date", type: "date" }
  ]

  useEffect(() => {
    document.title = "Dashboard"
    const fetchData = async () => {
      const result = await firebase.getCurrentUserExercises();
      setTableData(result);
    };
    fetchData();
  }, []);

  //Chart
  function generateDayWiseTimeSeries(baseval, count) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      let day = getFormattedDay(baseval);
      // console.log("getFormattedDay");
      // console.log(day);
      // console.log('tableData')
      // console.log(tableData)
      let currentExercise = tableData.filter(x => x.date === day);
      // console.log("currentExercise");
      // console.log(currentExercise);
      let totalTimes = 0;
      currentExercise.map(value => (totalTimes += Number(value.times)));
      series.push([x, totalTimes]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  const getFormattedDay = baseval => {
    var day = new Date(baseval);
    return `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`;
  };

  let oneMonth = new Date();
  oneMonth.setMonth(oneMonth.getMonth() - 1);

  let data = {
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
        text: "Daily exercise times by Month",
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
        name: "Exercises",
        data: generateDayWiseTimeSeries(
          oneMonth.getTime(),
          new Date(oneMonth.getFullYear(), oneMonth.getMonth(), 0).getDate() + 2
        )
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
          columns={columns}
          data={tableData}
          // style={{ boxShadow: "initial" }} //added
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve()
                  let items = [...tableData]
                  items.push(newData)
                  console.log('newData')
                  console.log(newData)

                  let day = new Date(newData.date);


                  setTableData([...tableData, {menu: newData.menu , times:newData.times, date: `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`}])
                  console.log('tableData')
                  console.log(tableData)
                  firebase.addExercise(newData)

                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  let items = [...tableData]
                  let foundIndex = items.findIndex(x => x.id == oldData.id);
                  items[foundIndex] = newData;
                  setTableData(items)
                  firebase.updateExercise(newData);
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  let items = [...tableData]
                  const filteredItems = items.filter(item => item.id !== oldData.id)
                  setTableData(filteredItems);
                  firebase.deleteExercise(oldData);
                }, 600);
              })
          }}
        />
      </main>
    </>
  );


}

export default withRouter(withStyles(styles)(Dashboard));
