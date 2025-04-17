import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// -- Layouts
import MainLayout from "layout/MainLayout";
import PublicLayout from "layout/PublicLayout";

// Pages
import Landing from "pages/Landing";
import SignUp from "pages/auth/SignUp";
import Login from "pages/auth/Login";
import Settings from "pages/dashboard/Settings";
import ContactUs from "pages/dashboard/ContactUs";
// Lazy loaded components

const Home = lazy(() => import("pages/dashboard/Home"));
const Transactions = lazy(() => import("pages/dashboard/Transactions"));

export const App = () => {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
