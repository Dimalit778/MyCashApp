import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";
import styles from "../../../pages/admin/AdminPages.module.css";

const Charts = ({
  userGrowthData,
  transactionData,
  selectedPeriod,
  setSelectedPeriod,
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e5e7eb",
          padding: 20,
        },
      },
    },
  };

  return (
    <Row className="g-4">
      <Col lg={8}>
        <Card className={styles.contentCard} data-cy="user-growth-chart">
          <Card.Header
            style={{
              backgroundColor: "var(--surface)",
              borderBottom: "1px solid var(--light-grey)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: "var(--light)" }}>
                User Growth
              </h5>
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
          <Card.Body style={{ height: "400px" }}>
            {userGrowthData && (
              <div data-cy="line-chart">
                <Line data={userGrowthData} options={chartOptions} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className={styles.contentCard} data-cy="transaction-types-chart">
          <Card.Header
            style={{
              backgroundColor: "var(--surface)",
              borderBottom: "1px solid var(--light-grey)",
            }}
          >
            <h5 className="mb-0" style={{ color: "var(--light)" }}>
              Transaction Types
            </h5>
          </Card.Header>
          <Card.Body style={{ height: "400px" }}>
            {transactionData && (
              <div data-cy="pie-chart">
                <Pie data={transactionData} options={pieOptions} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Charts;
