import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./AdminPages.module.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useGetUserTransactionsPaginatedQuery,
  useGetUserCategoriesQuery,
} from "services/api/adminApi";
import { useDeleteTransactionMutation } from "services/api/transactionsApi";
import Loader from "components/ui/loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

import UserTransactionsCard from "components/admin/userDetails/UserTransactionsCard";
import ProfileCard from "components/admin/userDetails/ProfileCard";
import UserCategoryCard from "components/admin/userDetails/UserCategoryCard";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("expenses");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  const { data: userData, isLoading: isLoadingUser } = useGetUserDetailsQuery(
    id,
    {
      skip: !id,
    }
  );

  const { data: transactionData, isLoading: isLoadingTransactions } =
    useGetUserTransactionsPaginatedQuery(
      {
        userId: id,
        type: activeTab,
        page: currentPage,
        limit: pageLimit,
        month: selectedMonth,
        year: selectedYear,
      },
      { skip: !id }
    );

  const { data: categories, isLoading: isLoadingCategories } =
    useGetUserCategoriesQuery(id, { skip: !id });

  const [deleteTransaction] = useDeleteTransactionMutation();

  const goBack = () => {
    navigate("/admin/users");
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === "month") {
      setSelectedMonth(value);
    } else if (type === "year") {
      setSelectedYear(value);
    } else if (type === "tab") {
      setActiveTab(value);
      setCurrentPage(1);
      setSelectedMonth("");
      setSelectedYear("");
    }
  };

  // Handle delete transaction
  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction({ id: transactionId }).unwrap();
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const months = [
    { value: "", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  ).map((year) => ({ value: year.toString(), label: year.toString() }));

  return (
    <div>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto">
              <Button
                variant="outline-light"
                onClick={goBack}
                className="me-3"
                data-cy="admin-user-details-back-button"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
            </Col>
            <Col>
              <h1 className={styles.pageTitle}>User Details</h1>
              <p className={styles.pageSubtitle}>
                View user details and transactions
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      {isLoadingUser || isLoadingTransactions || isLoadingCategories ? (
        <Loader />
      ) : (
        <Container fluid className="py-4">
          <Row className="g-4 mb-4">
            <Col lg={6}>
              <ProfileCard userData={userData} />
            </Col>

            <Col lg={6}>
              <UserCategoryCard categories={categories} />
            </Col>
          </Row>
          <Row>
            <Col>
              <UserTransactionsCard
                transactionData={transactionData}
                handleDelete={handleDelete}
                handleFilterChange={handleFilterChange}
                activeTab={activeTab}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                months={months}
                years={years}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default AdminUserDetails;
