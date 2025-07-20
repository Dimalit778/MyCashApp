import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import BrandLogo from "components/brandLogo";
import { useSelector } from "react-redux";
import MyButton from "components/ui/button";
import { currentUser } from "services/reducers/userSlice";
import { HOME_LINKS } from "constants/HomeLinks";
import { THEME } from "constants/Theme";
import { useLogoutMutation } from "services/api/authApi";
import CloudImage from "components/ui/cloudImage";
import styles from "./LeftSideBar.module.css";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const user = useSelector(currentUser);
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div data-cy="left-sidebar" className={styles.sidebar}>
      {/* Brand Logo Section */}
      <div data-cy="brand-logo" className={styles.brandSection}>
        <BrandLogo />
      </div>

      {/* User Profile Section */}
      <div data-cy="profile-image-container" className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <div data-cy="user-profile-image" className={styles.profileImage}>
            <CloudImage
              publicId={user.imageUrl}
              width={"100%"}
              height={"100%"}
              className="rounded-circle"
              alt="profile"
            />
          </div>
        </div>

        <div className={styles.userInfo}>
          <h3 data-cy="user-name" className={styles.userName}>
            {user.firstName + " " + user.lastName}
          </h3>
          <small data-cy="user-email" className={styles.userEmail}>
            {user.email}
          </small>
        </div>
      </div>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Navigation Links */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {HOME_LINKS.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={styles.navItem}>
                <NavLink
                  data-cy={`nav-${link.dataCy}`}
                  to={link.route}
                  className={`${styles.navLink} ${
                    isActive ? styles.navLinkActive : ""
                  }`}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={styles.navIcon}
                  />
                  <span className={styles.navLabel}>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={styles.logoutSection}>
        <MyButton
          data-cy="left-sidebar-logout-button"
          ariaLabel="Logout"
          bgColor={THEME.dark}
          className={styles.logoutButton}
          onClick={logoutHandler}
        >
          Logout
        </MyButton>
      </div>
    </div>
  );
};

export default LeftSideBar;
