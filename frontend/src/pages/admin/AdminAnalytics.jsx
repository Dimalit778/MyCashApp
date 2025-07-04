import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faChartBar,
  faChartPie,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AdminPages.module.css";

const AdminAnalytics = () => {
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row>
            <Col>
              <h1 className={styles.pageTitle}>Analytics & Reports</h1>
              <p className={styles.pageSubtitle}>
                Advanced analytics and reporting features
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <Row>
          <Col>
            <Card className={styles.contentCard}>
              <Card.Body className="text-center p-5">
                <div className={styles.comingSoon}>
                  <div className={styles.iconGrid}>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faChartBar} />
                    </div>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faChartPie} />
                    </div>
                  </div>

                  <h4 className={styles.comingSoonTitle}>
                    Analytics Dashboard
                  </h4>
                  <p className={styles.comingSoonText}>
                    Advanced analytics and reporting features are coming soon.
                    This section will include:
                  </p>

                  <div className={styles.featureList}>
                    <ul>
                      <li>User behavior analytics</li>
                      <li>Transaction trend analysis</li>
                      <li>Revenue and expense reports</li>
                      <li>Custom dashboard widgets</li>
                      <li>Exportable reports</li>
                      <li>Real-time monitoring</li>
                    </ul>
                  </div>

                  <Button
                    variant="primary"
                    className={styles.notifyBtn}
                    disabled
                  >
                    <FontAwesomeIcon icon={faDownload} className="me-2" />
                    Export Reports (Coming Soon)
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAnalytics;
