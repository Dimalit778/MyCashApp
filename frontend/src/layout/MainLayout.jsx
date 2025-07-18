import { Navigate, Outlet } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import LeftSideBar from "layout/LeftSideBar";

import TopBar from "layout/TopBar";
import { useSelector } from "react-redux";
import { currentUser } from "services/reducers/userSlice";
import BottomNav from "layout/BottomNav";

const MainLayout = () => {
  const user = useSelector(currentUser);

  if (user && user.role === "admin") {
    return <Navigate to="/admin/analytics" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div
      style={{ backgroundColor: "black", minHeight: "100vh", overflow: "auto" }}
    >
      <TopBar className="d-md-none" />

      <Row className="g-0">
        <Col
          md={3}
          lg={2}
          className="d-none d-md-block"
          data-cy="left-sidebar-container"
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
          <LeftSideBar />
        </Col>
        <Col
          data-cy="main-layout-outlet"
          xs={12}
          md={{ span: 9, offset: 3 }}
          lg={{ span: 10, offset: 2 }}
          className="main-content"
          style={{
            paddingTop: "65px",
            paddingBottom: "50px",
          }}
        >
          <Outlet />
        </Col>
      </Row>
      <BottomNav className="d-md-none" />
    </div>
  );
};

export default MainLayout;
