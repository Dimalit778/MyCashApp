import { Row, Col, Container } from "react-bootstrap";
import styles from "./AdminPages.module.css";

import AdminCategories from "components/admin/AdminCategories";

const AdminCategoriesPage = () => {
  return (
    <div>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h1 className={styles.pageTitle}>Default Categories</h1>
              <p className={styles.pageSubtitle}>
                Manage default categories for your application
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <AdminCategories />
      </Container>
    </div>
  );
};

export default AdminCategoriesPage;
