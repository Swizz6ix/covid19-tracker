import React, { useEffect, useState } from 'react';
import "./LineGraph";
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import {de, enGB} from 'date-fns/locale';
import numeral from "numeral";

ChartJs.register(
  CategoryScale, LinearScale, PointElement, LineElement,Title, Tooltip, Legend
);

const options = {
  legend: {
    display: false,
  },
  elements: {
    points: {
      radius:0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).fomat("+0,0");
    },
      },
    },
  scales: {
    x:{
        adapters: {
          date: {
              locale: enGB
            },
            type: "time",
            distribution: 'linear',
            time: {
              parser: "yyyy-MM-dd",
              unit: "month"
            }
        }
      },

    y:{
        grid: {
          display:false,
        },
        ticks: {
          callback: function (value, index, values) {
            return  numeral(value).format("0a");
          },
        },
      },
    
  },
}


 // convert the current data which is  in json format to chart format (i.e X, Y format)
  
const buildChartData = (data, casesType = "cases") => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

function LineGraph( {casesType = "cases", ...props}) {
  const [data, setData] = useState({});



    useEffect(() => {
      const getFiles = async () => {
        await fetch("https://disease.sh/v3/covid-19/Historical/all?lastdays=120")
        .then(response => response.json())
        .then((data) => {
          console.log('babi', data)
          let chartData = buildChartData(data, casesType)
          setData(chartData)
        })

      }

      return () => {
        getFiles();
      }
    }, [casesType]);

    
  return (
    <div className={props.className}>
      <h1>Plot Graph</h1>
      {data?.length > 0 && (
        <Line 
        options={options}
        data={{
          datasets:[{
            data: data,
            backgroundColor: "rbga(204, 16, 52, 0.3)",
            borderColor: "#CC1034",
          }]
        }} />
       )} 
    </div>
  )
}

export default LineGraph