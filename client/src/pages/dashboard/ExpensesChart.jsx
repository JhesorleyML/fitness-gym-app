import { Card, ProgressBar } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import PropTypes from "prop-types";
import "react-circular-progressbar/dist/styles.css";
import { useMemo, useState } from "react";

const ExpensesChart = ({ paymentData, expensesData }) => {
  const [percentage, setPercentage] = useState(0);
  const [targetPercentage, setTargetPercentage] = useState(0);

  // const tableLabelMemo = useMemo(
  //   () => tableData.map(() => ``),
  //   [tableData]
  // )

  //const percentage = 75; // Circular progress percentage
  //const targetPercentage = 32; // Horizontal bar percentage

  return (
    <Card className="p-3">
      <Card.Header as="h5" className="d-flex justify-content-between">
        <span>Monthly Expenses vs Income</span>
        <span>
          <i className="bi bi-gear"></i>
        </span>
      </Card.Header>
      <Card.Body className="d-flex flex-column align-items-center">
        <div style={{ width: "170px", marginBottom: "20px" }}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
              textColor: "#333",
              trailColor: "#d6d6d6",
              backgroundColor: "#f8f9fa",
            })}
          />
        </div>
        <div className="w-100 text-center">
          <h6 className="mb-2 text-warning">{targetPercentage}%</h6>
          <ProgressBar
            now={targetPercentage}
            variant="warning"
            style={{ height: "8px" }}
          />
          <small className="text-muted">Spendings Target</small>
        </div>
      </Card.Body>
    </Card>
  );
};

ExpensesChart.propTypes = {
  paymentData: PropTypes.array,
  expensesData: PropTypes.array,
};

export default ExpensesChart;
