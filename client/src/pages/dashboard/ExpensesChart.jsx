import { Card, ProgressBar } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import PropTypes from "prop-types";
import "react-circular-progressbar/dist/styles.css";
import { useMemo, useState } from "react";

const ExpensesChart = ({ paymentData, expensesData }) => {
  const { incomeVsExpensePercentage, targetPercentage } = useMemo(() => {
    const totalIncome = paymentData.reduce(
      (acc, curr) => acc + parseFloat(curr.totalAmount || 0),
      0
    );
    const totalExpenses = expensesData.reduce(
      (acc, curr) => acc + parseFloat(curr.totalAmount || 0),
      0
    );

    const incomeVsExpense =
      totalIncome > 0
        ? Math.round((totalExpenses / totalIncome) * 100)
        : totalExpenses > 0
        ? 100
        : 0;

    // Spending target - e.g., expenses should ideally be less than 40% of income
    const target = 40;
    const spendingTargetStatus = 
      totalIncome > 0 
        ? Math.round((totalExpenses / (totalIncome * (target / 100))) * 100)
        : 0;

    return {
      incomeVsExpensePercentage: Math.min(incomeVsExpense, 100),
      targetPercentage: Math.min(spendingTargetStatus, 100),
    };
  }, [paymentData, expensesData]);

  return (
    <Card className="p-3 h-100 shadow-sm">
      <Card.Header as="h5" className="bg-white border-0 py-3">
        <span>Expenses vs Income</span>
      </Card.Header>
      <Card.Body className="d-flex flex-column align-items-center justify-content-around">
        <div style={{ width: "160px", marginBottom: "20px" }}>
          <CircularProgressbar
            value={incomeVsExpensePercentage}
            text={`${incomeVsExpensePercentage}%`}
            styles={buildStyles({
              pathColor: incomeVsExpensePercentage > 70 ? "#dc3545" : "#0d6efd",
              textColor: "#333",
              trailColor: "#eee",
            })}
          />
          <div className="text-center mt-2">
            <small className="text-muted">Expenses as % of Income</small>
          </div>
        </div>
        <div className="w-100 mt-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Spendings vs Budget Target</small>
            <small className={`fw-bold ${targetPercentage > 90 ? "text-danger" : "text-success"}`}>
              {targetPercentage}%
            </small>
          </div>
          <ProgressBar
            now={targetPercentage}
            variant={targetPercentage > 90 ? "danger" : "success"}
            style={{ height: "8px" }}
          />
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
