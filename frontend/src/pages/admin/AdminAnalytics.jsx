import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import styles from "./AdminPages.module.css";
import {
  useGetUserStatsQuery,
  useGetUserHistoricalDataQuery,
} from "services/api/userApi";
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

import { Bar } from "react-chartjs-2";
import { format } from "date-fns";
import toast from "react-hot-toast";
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

  // Refetch historical data when period changes
  useEffect(() => {
    refetchHistorical();
  }, [selectedPeriod, refetchHistorical]);

  // Process historical data when it's available
  useEffect(() => {
    if (historicalData?.data) {
      const { userGrowth, transactionTypes } = historicalData.data;

      // Process user growth data
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

      // Process transaction types data
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

  const handleExportData = () => {
    if (!stats) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      statistics: {
        totalUsers: stats.totalUsers,
        adminUsers: stats.adminUsers,
        regularUsers: stats.regularUsers,
        newUsersLast30Days: stats.recentUsers,
        totalTransactions: stats.totalTransactions,
        totalCategories: stats.totalCategories,
      },
      historicalData: historicalData?.data || null,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

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
      <div className={styles.adminPage}>
        <Container fluid>
          <Card className={styles.contentCard}>
            <Card.Body className="text-center p-5">
              <p data-cy="error-message" style={{ color: "#ef4444" }}>
                Error loading analytics data
              </p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.adminPage} data-cy="admin-analytics-page">
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
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={handleExportData}
                data-cy="export-report-btn"
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Report
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
        {/* Stats Cards */}
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
              <Card.Body>
                <Row>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div className="text-center" data-cy="avg-transactions">
                      <h3>
                        {stats?.totalUsers > 0
                          ? (
                              stats?.totalTransactions / stats?.totalUsers
                            ).toFixed(1)
                          : "0"}
                      </h3>
                      <p className="text-muted mb-0">
                        Avg. Transactions per User
                      </p>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div className="text-center" data-cy="avg-categories">
                      <h3>
                        {stats?.totalUsers > 0
                          ? (
                              stats?.totalCategories / stats?.totalUsers
                            ).toFixed(1)
                          : "0"}
                      </h3>
                      <p className="text-muted mb-0">
                        Avg. Categories per User
                      </p>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div className="text-center" data-cy="growth-rate">
                      <h3>
                        {stats?.totalUsers > 0
                          ? (
                              (stats?.recentUsers / stats?.totalUsers) *
                              100
                            ).toFixed(1) + "%"
                          : "0%"}
                      </h3>
                      <p className="text-muted mb-0">User Growth Rate (30d)</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center" data-cy="admin-ratio">
                      <h3>
                        {stats?.totalUsers > 0
                          ? (
                              (stats?.adminUsers / stats?.totalUsers) *
                              100
                            ).toFixed(0) + "%"
                          : "0%"}
                      </h3>
                      <p className="text-muted mb-0">Admin to User Ratio</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* User Role Distribution */}
        <Row className="g-4 mt-2">
          <Col lg={6}>
            <Card className={styles.contentCard} data-cy="user-role-chart">
              <Card.Header
                style={{
                  backgroundColor: "var(--surface)",
                  borderBottom: "1px solid var(--light-grey)",
                }}
              >
                <h5 className="mb-0" style={{ color: "var(--light)" }}>
                  User Role Distribution
                </h5>
              </Card.Header>
              <Card.Body style={{ height: "300px" }}>
                {stats && (
                  <Bar
                    data={{
                      labels: ["Admins", "Regular Users"],
                      datasets: [
                        {
                          label: "Users by Role",
                          data: [stats.adminUsers, stats.regularUsers],
                          backgroundColor: ["#f59e0b", "#3b82f6"],
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAnalytics;
