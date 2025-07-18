import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import styles from "./AdminPages.module.css";
import {
  useGetUserStatsQuery,
  useGetUserHistoricalDataQuery,
} from "services/api/adminApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { format } from "date-fns";
import AdminStats from "components/admin/AdminStats";
import Charts from "components/admin/analytics/charts";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetUserStatsQuery();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const {
    data: historicalData,
    isLoading: historicalLoading,
    error: historicalError,
    refetch: refetchHistorical,
  } = useGetUserHistoricalDataQuery(selectedPeriod);

  const [userGrowthData, setUserGrowthData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // Refetch historical data when period changes
  useEffect(() => {
    refetchHistorical();
  }, [selectedPeriod, refetchHistorical]);

  // Process historical data when it's available
  useEffect(() => {
    if (historicalData?.data) {
      const { userGrowth, transactionTypes } = historicalData.data;

      const labels = userGrowth.map((item) =>
        format(new Date(item.date), "MMM d")
      );
      const data = userGrowth.map((item) => item.count);

      setUserGrowthData({
        labels,
        datasets: [
          {
            label: "New Users",
            data,
            borderColor: "#FF6500",
            backgroundColor: "rgba(255, 101, 0, 0.1)",
            tension: 0.4,
          },
        ],
      });

      if (transactionTypes && transactionTypes.length > 0) {
        const labels = transactionTypes.map((item) => item._id || "Other");
        const data = transactionTypes.map((item) => item.total);

        setTransactionData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"],
              borderWidth: 0,
            },
          ],
        });
      } else {
        // Fallback if no transaction data
        setTransactionData({
          labels: ["No Data"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#6b7280"],
              borderWidth: 0,
            },
          ],
        });
      }
    }
  }, [historicalData]);

  const isLoading = statsLoading || historicalLoading;
  const error = statsError || historicalError;

  if (isLoading) {
    return (
      <div className={styles.adminPage}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner
            data-cy="loading-spinner"
            animation="border"
            style={{ color: "#FF6500" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Card className={styles.contentCard}>
          <Card.Body className="text-center p-5">
            <p data-cy="error-message" style={{ color: "#ef4444" }}>
              Error loading analytics data
            </p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div data-cy="admin-analytics-page">
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h1 className={styles.pageTitle} data-cy="page-title">
                Analytics & Reports
              </h1>
              <p className={styles.pageSubtitle}>
                Platform overview and performance metrics
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
        <Row>
          <Col>
            <Card className={styles.contentCard} data-cy="stats-card">
              <Card.Body>
                <AdminStats />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className={styles.contentCard} data-cy="charts-container">
              <Card.Body>
                <Charts
                  userGrowthData={userGrowthData}
                  transactionData={transactionData}
                  selectedPeriod={selectedPeriod}
                  setSelectedPeriod={setSelectedPeriod}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Platform Summary */}
        <Row className="mt-4">
          <Col>
            <Card className={styles.contentCard} data-cy="platform-summary">
              <Card.Header
                style={{
                  backgroundColor: "var(--surface)",
                  borderBottom: "1px solid var(--light-grey)",
                }}
              >
                <h5 className="mb-0" style={{ color: "var(--light)" }}>
                  Platform Summary
                </h5>
              </Card.Header>
              <Card.Body className="bg-bl ack">
                <Row>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="text-center" data-cy="avg-transactions">
                      <h3 style={{ color: "var(--light)" }}>
                        {stats?.totalUsers > 0
                          ? (
                              stats?.totalTransactions / stats?.totalUsers
                            ).toFixed(1)
                          : "0"}
                      </h3>
                      <p
                        className=" mb-0"
                        style={{ color: "var(--light-grey)" }}
                      >
                        Avg. Transactions per User
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div
                      className="text-center text-light"
                      data-cy="avg-categories"
                    >
                      <h3 style={{ color: "var(--light)" }}>
                        {stats?.totalUsers > 0
                          ? (
                              stats?.totalCategories / stats?.totalUsers
                            ).toFixed(1)
                          : "0"}
                      </h3>
                      <p
                        className=" mb-0"
                        style={{ color: "var(--light-grey)" }}
                      >
                        Avg. Categories per User
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="text-center " data-cy="growth-rate">
                      <h3 style={{ color: "var(--light)" }}>
                        {stats?.totalUsers > 0
                          ? (
                              (stats?.recentUsers / stats?.totalUsers) *
                              100
                            ).toFixed(1) + "%"
                          : "0%"}
                      </h3>
                      <p
                        className=" mb-0"
                        style={{ color: "var(--light-grey)" }}
                      >
                        User Growth Rate (30d)
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAnalytics;
