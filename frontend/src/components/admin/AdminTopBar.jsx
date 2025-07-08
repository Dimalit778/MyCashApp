import React, { useState } from "react";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import BrandLogo from "components/brandLogo";
import AdminSidebar from "./AdminSidebar";

const AdminTopBar = ({ className }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar
        data-cy="admin-topBar"
        className={className}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "black",
          height: "65px",
          zIndex: 999,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "0 1rem",
        }}
      >
        <Navbar.Brand>
          <BrandLogo />
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link
            onClick={handleShow}
            style={{ color: "white" }}
            data-cy="admin-topBar-hamburger"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </Nav.Link>
        </Nav>
      </Navbar>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        style={{
          backgroundColor: "black",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          width: "200px",
        }}
      >
        <Offcanvas.Body style={{ padding: 0 }}>
          <AdminSidebar onClose={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AdminTopBar;
