import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Nav,
  Table,
  Form,
  Modal,
} from "react-bootstrap";
import styles from "./AdminPages.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "services/api/userApi";
import {
  useGetUserTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "services/api/transactionsApi";
import { useGetUserCategoriesQuery } from "services/api/categoriesApi";
import Loader from "components/ui/loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faEnvelope,
  faMoneyBillWave,
  faChartPie,
  faArrowDown,
  faArrowUp,
  faEdit,
  faTrash,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import CloudImage from "components/ui/cloudImage";
import toast from "react-hot-toast";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expenses");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // Fetch user details
  const { data: userData, isLoading: isLoadingUser } = useGetUserDetailsQuery(
    id,
    {
      skip: !id,
    }
  );

  // Fetch user transactions
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetUserTransactionsQuery({ userId: id, type: activeTab }, { skip: !id });

  // Fetch user categories
  const { data: categories, isLoading: isLoadingCategories } =
    useGetUserCategoriesQuery({ userId: id }, { skip: !id });

  // Mutations
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const goBack = () => {
    navigate("/admin/users");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionTotal = () => {
    if (!filteredTransactions) return 0;
    return filteredTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  const getCategoryName = (category) => {
    if (category && typeof category === "object" && category.name) {
      return category.name;
    }
    if (typeof category === "string") {
      return category;
    }
    return "Unknown";
  };

  // Filter transactions by month
  const filteredTransactions = transactions?.filter((transaction) => {
    if (!selectedMonth && !selectedYear) return true;

    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();

    if (selectedMonth && selectedYear) {
      return (
        transactionMonth === parseInt(selectedMonth) &&
        transactionYear === parseInt(selectedYear)
      );
    } else if (selectedYear) {
      return transactionYear === parseInt(selectedYear);
    }

    return true;
  });

  // Handle edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category._id || transaction.category,
      date: new Date(transaction.date).toISOString().split("T")[0],
    });
    setShowEditModal(true);
  };

  // Handle update transaction
  const handleUpdate = async () => {
    try {
      await updateTransaction({
        id: editingTransaction._id,
        ...editFormData,
        amount: parseFloat(editFormData.amount),
      }).unwrap();
      toast.success("Transaction updated successfully");
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error("Failed to update transaction");
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

  if (isLoadingUser || isLoadingTransactions || isLoadingCategories)
    return <Loader />;

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto">
              <Button variant="outline-light" onClick={goBack} className="me-3">
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  data-cy="admin-user-details-back-button"
                />
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

      <Container fluid className="py-4">
        {/* User Details and Categories Row */}
        <Row className="g-4 mb-4">
          {/* User Profile Card */}
          <Col lg={6}>
            <Card className={styles.contentCard} style={{ height: "100%" }}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <CloudImage
                    publicId={userData?.user?.imageUrl}
                    className="rounded-circle mb-3"
                    width={120}
                    height={120}
                  />
                  <h3 style={{ color: "var(--light)" }}>
                    {userData?.user?.firstName} {userData?.user?.lastName}
                  </h3>
                  <Badge
                    bg={
                      userData?.user?.role === "admin" ? "warning" : "primary"
                    }
                    className="px-3 py-2"
                  >
                    {userData?.user?.role}
                  </Badge>
                </div>

                <div className="mt-4">
                  <p
                    className="d-flex align-items-center mb-3"
                    style={{ color: "var(--light)" }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="me-3" />
                    {userData?.user?.email}
                  </p>
                  <p
                    className="d-flex align-items-center mb-3"
                    style={{ color: "var(--light)" }}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-3" />
                    Joined: {formatDate(userData?.user?.createdAt)}
                  </p>
                  <p
                    className="d-flex align-items-center mb-3"
                    style={{ color: "var(--light)" }}
                  >
                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-3" />
                    Total Transactions: {transactions ? transactions.length : 0}
                  </p>
                  <p
                    className="d-flex align-items-center mb-3"
                    style={{ color: "var(--light)" }}
                  >
                    <FontAwesomeIcon icon={faChartPie} className="me-3" />
                    Total Categories: {categories ? categories.length : 0}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Categories Card */}
          <Col lg={6}>
            <Card className={styles.contentCard} style={{ height: "100%" }}>
              <Card.Header
                style={{
                  backgroundColor: "var(--surface)",
                  borderBottom: "1px solid var(--light-grey)",
                }}
              >
                <h5 className="mb-0" style={{ color: "var(--light)" }}>
                  <FontAwesomeIcon icon={faChartPie} className="me-2" />
                  User Categories
                </h5>
              </Card.Header>
              <Card.Body
                style={{
                  backgroundColor: "var(--dark-bg)",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div className="table-responsive">
                  <Table hover className="dark-table table-dark">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>
                              <Badge
                                bg={
                                  category.type === "expenses"
                                    ? "danger"
                                    : "success"
                                }
                              >
                                {category.type}
                              </Badge>
                            </td>
                            <td>{formatDate(category.createdAt)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            No categories found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Transactions Section */}
        <Row>
          <Col>
            <Card className={styles.contentCard}>
              <Card.Header
                style={{
                  backgroundColor: "var(--surface)",
                  borderBottom: "1px solid var(--light-grey)",
                }}
              >
                <Row className="align-items-center">
                  <Col md={6}>
                    <Nav
                      variant="tabs"
                      className="border-0"
                      style={{ marginBottom: "-1px" }}
                    >
                      <Nav.Item>
                        <Nav.Link
                          active={activeTab === "expenses"}
                          onClick={() => setActiveTab("expenses")}
                          style={{
                            backgroundColor:
                              activeTab === "expenses"
                                ? "var(--dark-bg)"
                                : "transparent",
                            color: "var(--light)",
                            border:
                              activeTab === "expenses"
                                ? "1px solid var(--light-grey)"
                                : "none",
                            borderBottom:
                              activeTab === "expenses"
                                ? "1px solid var(--dark-bg)"
                                : "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="me-2"
                          />
                          Expenses
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          active={activeTab === "incomes"}
                          onClick={() => setActiveTab("incomes")}
                          style={{
                            backgroundColor:
                              activeTab === "incomes"
                                ? "var(--dark-bg)"
                                : "transparent",
                            color: "var(--light)",
                            border:
                              activeTab === "incomes"
                                ? "1px solid var(--light-grey)"
                                : "none",
                            borderBottom:
                              activeTab === "incomes"
                                ? "1px solid var(--dark-bg)"
                                : "none",
                          }}
                        >
                          <FontAwesomeIcon icon={faArrowUp} className="me-2" />
                          Income
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    <Row className="g-2 align-items-center">
                      <Col xs="auto">
                        <FontAwesomeIcon
                          icon={faFilter}
                          style={{ color: "var(--light)" }}
                        />
                      </Col>
                      <Col>
                        <Form.Select
                          size="sm"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          style={{
                            backgroundColor: "var(--dark-bg)",
                            color: "var(--light)",
                            border: "1px solid var(--light-grey)",
                          }}
                        >
                          {months.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col>
                        <Form.Select
                          size="sm"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          style={{
                            backgroundColor: "var(--dark-bg)",
                            color: "var(--light)",
                            border: "1px solid var(--light-grey)",
                          }}
                        >
                          {years.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body style={{ backgroundColor: "var(--dark-bg)" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 style={{ color: "var(--light)" }}>
                    {activeTab === "expenses" ? "Expense" : "Income"}{" "}
                    Transactions
                    {selectedMonth &&
                      ` - ${
                        months.find((m) => m.value === selectedMonth)?.label
                      }`}
                    {selectedYear && ` ${selectedYear}`}
                  </h4>
                  <h5 style={{ color: "var(--primary-orange)" }}>
                    Total: ${getTransactionTotal().toFixed(2)}
                  </h5>
                </div>

                <div className="table-responsive">
                  <Table hover className="dark-table table-dark">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions &&
                      filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.description}</td>
                            <td>{getCategoryName(transaction.category)}</td>
                            <td>${transaction.amount.toFixed(2)}</td>
                            <td>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(transaction)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(transaction._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No {activeTab === "expenses" ? "expense" : "income"}{" "}
                            transactions found
                            {selectedMonth && " for the selected period"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Transaction Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--light-grey)",
          }}
        >
          <Modal.Title style={{ color: "var(--light)" }}>
            Edit Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "var(--dark-bg)" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>
                Description
              </Form.Label>
              <Form.Control
                type="text"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editFormData.amount}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, amount: e.target.value })
                }
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>
                Category
              </Form.Label>
              <Form.Select
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    category: e.target.value,
                  })
                }
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              >
                {categories
                  ?.filter((cat) => cat.type === activeTab)
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>Date</Form.Label>
              <Form.Control
                type="date"
                value={editFormData.date}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, date: e.target.value })
                }
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--light-grey)",
          }}
        >
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUserDetails;
