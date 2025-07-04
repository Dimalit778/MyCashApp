import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AdminStats from "components/admin/AdminStats";
import styles from "./AdminPages.module.css";

const AdminDashboard = () => {
  console.log("admin dashboard");

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row>
            <Col>
              <h1 className={styles.pageTitle}>Dashboard Overview</h1>
              <p className={styles.pageSubtitle}>
                Monitor your application's performance and user activity
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="container ">
        <Row>
          <Col>
            <Card className={styles.contentCard}>
              <Card.Body>
                <AdminStats />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions Section */}
        <Row className="mt-4">
          <Col lg={6}>
            <Card className={styles.quickActionCard}>
              <Card.Body>
                <h5 className={styles.cardTitle}>Recent Activity</h5>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>
                        New user registrations
                      </div>
                      <div className={styles.activityTime}>Last 24 hours</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>
                        Transaction activity
                      </div>
                      <div className={styles.activityTime}>System wide</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className={styles.quickActionCard}>
              <Card.Body>
                <h5 className={styles.cardTitle}>System Health</h5>
                <div className={styles.healthMetrics}>
                  <div className={styles.healthItem}>
                    <span className={styles.healthLabel}>Server Status</span>
                    <span className={`${styles.healthValue} ${styles.healthy}`}>
                      Online
                    </span>
                  </div>
                  <div className={styles.healthItem}>
                    <span className={styles.healthLabel}>Database</span>
                    <span className={`${styles.healthValue} ${styles.healthy}`}>
                      Connected
                    </span>
                  </div>
                  <div className={styles.healthItem}>
                    <span className={styles.healthLabel}>Storage</span>
                    <span className={`${styles.healthValue} ${styles.healthy}`}>
                      Available
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
