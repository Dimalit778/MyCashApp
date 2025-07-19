import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import BrandLogo from "components/brandLogo";
import logoutIcon from "assets/icons/logoutIcon.svg";
import { currentUser } from "services/reducers/userSlice";
import { useLogoutMutation } from "services/api/authApi";
import CloudImage from "components/ui/cloudImage";

const TopBar = ({ className }) => {
  const user = useSelector(currentUser);

  const [logout] = useLogoutMutation();
  const location = useLocation();
  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Navbar
      data-cy="top-bar"
      expand="lg"
      className={`${className} px-2`}
      style={{
        background: `linear-gradient(to top, #434343, #000000)`,
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        width: "100%",
        maxWidth: "100%",
        height: "65px",
        zIndex: 999,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Navbar.Brand data-cy="app-logo-link-to-home" as={Link} to="/home">
          <BrandLogo className="me-2" />
        </Navbar.Brand>
        <Nav>
          {!user ? (
            <div className="d-flex justify-content-center gap-2">
              <Nav.Link
                as={Link}
                to="/signup"
                className={`btn-outline-light ${
                  location.pathname === "/signup"
                }`}
                data-cy="signup-link"
              >
                Sign Up
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/login"
                className={`btn-outline-light ${
                  location.pathname === "/login"
                }`}
                data-cy="login-link"
              >
                Login
              </Nav.Link>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <div className="me-4">
                <Button
                  data-cy="top-bar-logout-button"
                  variant="link"
                  className="text-light p-0"
                  onClick={logoutHandler}
                >
                  <img
                    data-cy="nav-profile-icon"
                    src={logoutIcon}
                    alt="logout"
                    width="24"
                    height="24"
                  />
                </Button>
              </div>
              <div data-cy="top-bar-profile-image" className="text-light">
                <CloudImage
                  publicId={user?.imageUrl}
                  width={40}
                  height={40}
                  className="rounded-circle"
                  alt="profile"
                />
              </div>
            </div>
          )}
        </Nav>
      </div>
    </Navbar>
  );
};

export default TopBar;
