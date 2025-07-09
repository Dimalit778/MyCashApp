import { Row, Col, Container, Spinner } from "react-bootstrap";
import AdminDbActions from "components/admin/AdminDbActions";
import AdminDbExport from "components/admin/AdminDbExport";
import styles from "./AdminPages.module.css";
import { useGetDatabaseStatsQuery } from "services/api/adminApi";

const MaintenanceSettings = () => {
  const { data: stats, isLoading } = useGetDatabaseStatsQuery();

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h1 className={styles.pageTitle}>Database</h1>
              <p className={styles.pageSubtitle}>
                Manage database operations and export data
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container fluid>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            <Col lg={6}>
              <AdminDbActions stats={stats} />
            </Col>
            <Col lg={6}>
              <AdminDbExport stats={stats} />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MaintenanceSettings;
