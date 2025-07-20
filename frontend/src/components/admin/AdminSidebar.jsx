import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartBar,
  faSignOutAlt,
  faDatabase,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";

import { currentUser } from "services/reducers/userSlice";
import { useLogoutMutation } from "services/api/authApi";

import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";
import styles from "./AdminSidebar.module.css";

const ADMIN_LINKS = [
  {
    label: "Analytics",
    route: "/admin/analytics",
    icon: faChartBar,
    dataCy: "analytics",
  },
  {
    label: "Users",
    route: "/admin/users",
    icon: faUsers,
    dataCy: "users",
  },
  {
    label: "Categories",
    route: "/admin/categories",
    icon: faTableCellsLarge,
    dataCy: "categories",
  },
  {
    label: "Database",
    route: "/admin/database",
    icon: faDatabase,
    dataCy: "database",
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
    <div className={styles.sidebar} data-cy="admin-sidebar">
      <div className={styles.profileSection}>
        <div className={styles.userInfo} data-cy="admin-sidebar-user-info">
          <h2 className={styles.userName} data-cy="user-name">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className={styles.userRole} data-cy="user-role">
            Administrator
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation} data-cy="admin-sidebar-navigation">
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
                    className="me-2"
                    size="xl"
                    color="grey"
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
          type="button"
          ariaLabel="Logout"
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
