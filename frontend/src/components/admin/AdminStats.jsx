import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserShield,
  faUserCheck,
  faClock,
  faExchangeAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "components/ui/loader/Loader";

import "./adminStyles.css";
import { useGetUserStatsQuery } from "services/api/userApi";

const StatCard = ({ icon, title, value, color, subtitle }) => (
  <Col md={6} lg={4} className="mb-4">
    <Card
      className={`stat-card border-0 shadow-sm h-100`}
      style={{ backgroundColor: "var(--light)" }}
    >
      <Card.Body className="d-flex align-items-center">
        <div
          className={`stat-icon rounded-circle d-flex align-items-center justify-content-center me-3 bg-${color}`}
        >
          {icon}
        </div>
        <div className="flex-grow-1">
          <h3 className="stat-value mb-1">{value}</h3>
          <p className="stat-title mb-0 text-muted">{title}</p>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const AdminStats = () => {
  const { data: stats, isLoading, error } = useGetUserStatsQuery();

  if (isLoading) return <Loader />;
  if (error)
    return <div className="alert alert-danger">Error loading statistics</div>;

  return (
    <div className="admin-stats">
      <Row>
        <StatCard
          icon={<FontAwesomeIcon icon={faUsers} size="lg" />}
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="primary"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faUserShield} size="lg" />}
          title="Admin Users"
          value={stats?.adminUsers || 0}
          color="warning"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faUserCheck} size="lg" />}
          title="Regular Users"
          value={stats?.regularUsers || 0}
          color="success"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faClock} size="lg" />}
          title="New Users"
          value={stats?.recentUsers || 0}
          color="info"
          subtitle="Last 30 days"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faExchangeAlt} size="lg" />}
          title="Total Transactions"
          value={stats?.totalTransactions || 0}
          color="secondary"
        />
        <StatCard
          icon={<FontAwesomeIcon icon={faTags} size="lg" />}
          title="Total Categories"
          value={stats?.totalCategories || 0}
          color="dark"
        />
      </Row>
    </div>
  );
};

export default AdminStats;
