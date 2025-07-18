import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserManagement from "components/admin/UserManagement";
import styles from "./AdminPages.module.css";

const AdminUsers = () => {
  return (
    <div>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row>
            <Col>
              <h1 className={styles.pageTitle}>User Management</h1>
              <p className={styles.pageSubtitle}>
                Manage user accounts, roles, and permissions
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <UserManagement />
      </Container>
    </div>
  );
};

export default AdminUsers;
