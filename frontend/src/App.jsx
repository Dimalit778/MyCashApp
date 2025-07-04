import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// -- Layouts
import MainLayout from "layout/MainLayout";
import PublicLayout from "layout/PublicLayout";
import AdminLayout from "layout/AdminLayout";

// Pages
import Landing from "pages/Landing";
import SignUp from "pages/auth/SignUp";
import Login from "pages/auth/Login";
import Settings from "pages/dashboard/Settings";
import ContactUs from "pages/dashboard/ContactUs";

// Admin Pages
import AdminDashboard from "pages/admin/AdminDashboard";
import AdminUsers from "pages/admin/AdminUsers";
import AdminAnalytics from "pages/admin/AdminAnalytics";
import AdminSettings from "pages/admin/AdminSettings";
import AdminUserDetails from "pages/admin/AdminUserDetails";

// Lazy loaded components
const Home = lazy(() => import("pages/dashboard/Home"));
const Transactions = lazy(() => import("pages/dashboard/Transactions"));

export const App = () => {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="home"
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="transactions/:type"
            element={
              <Suspense>
                <Transactions />
              </Suspense>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
