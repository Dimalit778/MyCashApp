import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentUser } from "services/reducers/userSlice";
import { Col, Row } from "react-bootstrap";

import AdminTopBar from "components/admin/AdminTopBar";

import AdminSidebar from "components/admin/AdminSidebar";

const AdminLayout = () => {
  const user = useSelector(currentUser);

  // Redirect non-admin users
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      <AdminTopBar className="d-md-none" />
      <Row className="g-0">
        <Col
          md={3}
          lg={2}
          className="d-none d-md-block"
          data-cy="admin-sidebar-container"
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 1030,
            backgroundColor: "black",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <AdminSidebar />
        </Col>
        <Col
          data-cy="admin-layout-outlet"
          xs={12}
          md={{ span: 9, offset: 3 }}
          lg={{ span: 10, offset: 2 }}
          className="admin-content"
        >
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default AdminLayout;
