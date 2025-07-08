export const isMobile = () => {
  return (
    Cypress.config("viewportWidth") <
    Cypress.env("mobileViewportWidthBreakpoint")
  );
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
export const adminRoutes = [
  { dataCy: "nav-users", path: "/admin/users", title: "User Management" },
  {
    dataCy: "nav-categories",
    path: "/admin/categories",
    title: "Default Categories",
  },
  { dataCy: "nav-database", path: "/admin/database", title: "Database" },
  {
    dataCy: "nav-analytics",
    path: "/admin/analytics",
    title: "Analytics & Reports",
  },
];
