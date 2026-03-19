import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SubPaymentChart = ({ tableData }) => {
  const [tableLabel, setTableLabel] = useState([]);
  const [tableDataSet, setTableDataSet] = useState([]);
  //console.log("Data Set: ", tableData);
  const tableLabelMemo = useMemo(
    () => tableData.map((element) => `${element.dateDay}-${element.month}`),
    [tableData]
  );

  const tableDataSetMemo = useMemo(
    () => tableData.map((element) => element.amount),
    [tableData]
  );

  useEffect(() => {
    setTableLabel(tableLabelMemo);
    setTableDataSet(tableDataSetMemo);
  }, [tableLabelMemo, tableDataSetMemo]);

  const chartData = {
    labels: tableLabel,
    datasets: [
      {
        type: "bar",
        label: "Gym Payments",
        data: tableDataSet,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderWidth: 1,
      },
      // {
      //   type: "line",
      //   label: "Social Media",
      //   data: [100, 30, 25, 35, 10, 15, 18, 22, 40, 32, 28, 10],
      //   borderColor: "rgba(75, 192, 192, 1)",
      //   borderWidth: 2,
      //   tension: 0.4,
      //   fill: false,
      //   pointBackgroundColor: "white",
      //   pointBorderColor: "rgba(75, 192, 192, 1)",
      //   pointRadius: 5,
      // },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      y1: {
        position: "right",
        beginAtZero: true,
      },
    },
  };
  return (
    <Card className="p-3">
      <Card.Header as="h5">Subscription Payments</Card.Header>
      <Card.Body>
        <div style={{ height: "250px" }}>
          <Bar options={chartOptions} data={chartData} />
        </div>
      </Card.Body>
    </Card>
  );
};

SubPaymentChart.propTypes = {
  tableData: PropTypes.array,
};

export default SubPaymentChart;
