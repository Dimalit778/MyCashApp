import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import EditProfile from "components/settings/EditProfile";
import UploadImage from "components/settings/UploadImage";

import DeleteUser from "components/settings/DeleteUser";

const Settings = () => {
  return (
    <Container
      fluid
      className="p-3 d-flex flex-column "
      style={{ minHeight: "80vh" }}
    >
      <Row className="g-4">
        <Col xs={12} lg={5}>
          <UploadImage />
        </Col>
        <Col xs={12} lg={7}>
          <EditProfile />
        </Col>
      </Row>
      <div className="mt-auto">
        <DeleteUser />
      </div>
    </Container>
  );
};

export default Settings;
