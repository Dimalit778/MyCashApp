import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faServer,
  faShieldAlt,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AdminPages.module.css";

const AdminSettings = () => {
  console.log("admin settings");
  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row>
            <Col>
              <h1 className={styles.pageTitle}>Admin Settings</h1>
              <p className={styles.pageSubtitle}>
                System configuration and administrative settings
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
                      <FontAwesomeIcon icon={faCog} />
                    </div>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faServer} />
                    </div>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </div>
                    <div className={styles.iconItem}>
                      <FontAwesomeIcon icon={faDatabase} />
                    </div>
                  </div>

                  <h4 className={styles.comingSoonTitle}>Admin Settings</h4>
                  <p className={styles.comingSoonText}>
                    Administrative configuration panel is coming soon. This
                    section will include:
                  </p>

                  <div className={styles.featureList}>
                    <ul>
                      <li>System configuration</li>
                      <li>Security settings</li>
                      <li>Email templates</li>
                      <li>API rate limiting</li>
                      <li>Backup management</li>
                      <li>Maintenance mode</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline-primary"
                    className={styles.notifyBtn}
                    disabled
                  >
                    <FontAwesomeIcon icon={faCog} className="me-2" />
                    Configure Settings (Coming Soon)
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

export default AdminSettings;
