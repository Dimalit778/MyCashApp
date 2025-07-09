import { useState } from "react";
import { Card, Button, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faExclamationTriangle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";
import styles from "../../pages/admin/AdminPages.module.css";
import { useDatabaseActionsMutation } from "services/api/adminApi";

const AdminDbActions = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [databaseActions] = useDatabaseActionsMutation();
  const showConfirmDialog = (action, title, message) => {
    setConfirmAction(() => action);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    try {
      await confirmAction();
      toast.success("Operation completed successfully");
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("Operation failed: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Unified database operation function
  const performDatabaseOperation = (operation, title, message) => {
    showConfirmDialog(
      async () => {
        const response = await databaseActions({ operation });
        console.log("response", response);
      },
      title,
      message
    );
  };

  // Database operations using the unified function
  const deleteAllUsers = () => {
    performDatabaseOperation(
      "users",
      "Delete All Users",
      "WARNING: This will permanently delete ALL users from the database. This action cannot be undone."
    );
  };

  const deleteAllTransactions = () => {
    performDatabaseOperation(
      "transactions",
      "Delete All Transactions",
      "WARNING: This will permanently delete ALL transactions from the database. This action cannot be undone."
    );
  };

  const deleteAllCategories = () => {
    performDatabaseOperation(
      "categories",
      "Delete All Categories",
      "WARNING: This will permanently delete ALL user categories from the database. This action cannot be undone."
    );
  };

  const deleteAllDefaultCategories = () => {
    performDatabaseOperation(
      "default-categories",
      "Delete All Default Categories",
      "WARNING: This will permanently delete ALL default categories from the database. This action cannot be undone."
    );
  };

  const deleteAllExpenses = () => {
    performDatabaseOperation(
      "expenses",
      "Delete All Expenses",
      "WARNING: This will permanently delete ALL expense transactions from the database. This action cannot be undone."
    );
  };

  const deleteAllIncomes = () => {
    performDatabaseOperation(
      "incomes",
      "Delete All Incomes",
      "WARNING: This will permanently delete ALL income transactions from the database. This action cannot be undone."
    );
  };

  const deleteAllData = () => {
    performDatabaseOperation(
      "all",
      "Delete All Data",
      "WARNING: This will permanently delete ALL data from the database including users, transactions, and categories. This action cannot be undone."
    );
  };

  return (
    <>
      <Card className={styles.contentCard} style={{ height: "100%" }}>
        <Card.Header
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--light-grey)",
          }}
        >
          <h5
            className="mb-0"
            style={{ color: "var(--light)" }}
            data-cy="db-actions-title"
          >
            <FontAwesomeIcon icon={faDatabase} className="me-2" />
            Database Operations
          </h5>
        </Card.Header>
        <Card.Body>
          <div className={styles.maintenanceActions}>
            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Users</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all users
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllUsers}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Transactions</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all transactions
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllTransactions}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Categories</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all categories
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllCategories}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Default Categories</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all default categories
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllDefaultCategories}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Expenses</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all expenses
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllExpenses}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>Incomes</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all incomes
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllIncomes}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div>
                <h6 style={{ color: "var(--light)" }}>All Data</h6>
                <p className="text-danger mb-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  This will delete all data
                </p>
              </div>
              <Button
                variant="danger"
                onClick={deleteAllData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" className="me-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "var(--surface)", color: "var(--light)" }}
        >
          <Modal.Title>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-danger me-2"
            />
            {confirmTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "var(--surface)", color: "var(--light)" }}
        >
          <p>{confirmMessage}</p>
          <p className="fw-bold text-danger">
            Are you sure you want to proceed?
          </p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "var(--surface)" }}>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {isLoading ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : (
              <FontAwesomeIcon icon={faTrash} className="me-2" />
            )}
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDbActions;
