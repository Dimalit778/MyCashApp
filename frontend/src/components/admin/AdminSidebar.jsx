import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faCog,
  faChartBar,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { currentUser } from "services/reducers/userSlice";
import { useLogoutMutation } from "services/api/authApi";

import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";
import styles from "./AdminSidebar.module.css";

const ADMIN_LINKS = [
  {
    label: "Dashboard",
    route: "/admin",
    icon: faTachometerAlt,
    dataCy: "dashboard",
  },
  {
    label: "Users",
    route: "/admin/users",
    icon: faUsers,
    dataCy: "users",
  },
  {
    label: "Analytics",
    route: "/admin/analytics",
    icon: faChartBar,
    dataCy: "analytics",
  },
  {
    label: "Settings",
    route: "/admin/settings",
    icon: faCog,
    dataCy: "settings",
  },
];

const AdminSidebar = ({ onClose }) => {
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
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>
            {user?.firstName} {user?.lastName}
          </h2>
          <p className={styles.userRole}>Administrator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {ADMIN_LINKS.map((link) => {
            const isActive =
              link.route === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.route);

            return (
              <li key={link.label} className={styles.navItem}>
                <NavLink
                  data-cy={`nav-${link.dataCy}`}
                  to={link.route}
                  className={`${styles.navLink} ${
                    isActive ? styles.navLinkActive : ""
                  }`}
                  onClick={onClose}
                >
                  <FontAwesomeIcon
                    icon={link.icon}
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
          data-cy="admin-sidebar-logout-button"
          bgColor={THEME.dark}
          className={styles.logoutButton}
          onClick={logoutHandler}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </MyButton>
      </div>
    </div>
  );
};

export default AdminSidebar;
