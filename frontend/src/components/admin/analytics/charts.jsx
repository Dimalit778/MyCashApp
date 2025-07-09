import React from "react";
import { Row, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";

const Charts = ({ userGrowthData, selectedPeriod, setSelectedPeriod }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: {
            size: 14,
            family: "Monospace",
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.1)",
        },
        ticks: {
          color: "#e5e7eb",
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.1)",
        },
        ticks: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <Row className="p-3 " style={{ minHeight: "35vh" }}>
      <Card
        style={{
          backgroundColor: "var(--dark-bg)",
          border: "1px solid var(--light-grey)",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
        data-cy="user-growth-chart"
      >
        <Card.Header className="border-0 border-bottom border-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-light">User Growth</h5>
            <select
              data-cy="period-selector"
              className="form-select form-select-sm"
              style={{
                width: "auto",
                backgroundColor: "var(--dark-bg)",
                color: "var(--light)",
                border: "1px solid var(--light-grey)",
              }}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </Card.Header>
        <Card.Body>
          {userGrowthData && (
            <div data-cy="line-chart">
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          )}
        </Card.Body>
      </Card>
    </Row>
  );
};

export default Charts;
