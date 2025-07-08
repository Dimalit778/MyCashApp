import { useState } from "react";
import { Card, Col, Button, Badge, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer, faDownload } from "@fortawesome/free-solid-svg-icons";
import styles from "../../pages/admin/AdminPages.module.css";
import {
  USER_URL,
  TRANSACTION_URL,
  CATEGORY_URL,
  DEFAULT_CATEGORY_URL,
} from "config/api";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminDbExport = ({ stats }) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log("stats", stats.data.totalUsers);
  // Export data functions
  const exportData = async (dataType) => {
    setIsLoading(true);
    try {
      let response, data, fileName, title;

      switch (dataType) {
        case "users":
          response = await fetch(`${USER_URL}/admin/all?limit=1000`, {
            credentials: "include",
          });
          data = await response.json();
          fileName = "users_export";
          title = "Users Export";
          break;
        case "transactions":
          response = await fetch(`${TRANSACTION_URL}/yearly`, {
            credentials: "include",
          });
          data = await response.json();
          fileName = "transactions_export";
          title = "Transactions Export";
          break;
        case "categories":
          response = await fetch(`${CATEGORY_URL}/get?type=all`, {
            credentials: "include",
          });
          data = await response.json();
          fileName = "categories_export";
          title = "Categories Export";
          break;
        case "defaultCategories":
          response = await fetch(`${DEFAULT_CATEGORY_URL}`, {
            credentials: "include",
          });
          data = await response.json();
          fileName = "default_categories_export";
          title = "Default Categories Export";
          break;
        case "expenses":
          response = await fetch(
            `${TRANSACTION_URL}/monthly?type=expenses&year=${new Date().getFullYear()}&month=${new Date().getMonth()}`,
            { credentials: "include" }
          );
          data = await response.json();
          fileName = "expenses_export";
          title = "Expenses Export";
          break;
        case "incomes":
          response = await fetch(
            `${TRANSACTION_URL}/monthly?type=incomes&year=${new Date().getFullYear()}&month=${new Date().getMonth()}`,
            { credentials: "include" }
          );
          data = await response.json();
          fileName = "incomes_export";
          title = "Incomes Export";
          break;
        case "all":
          // Export all data
          const allData = {};

          const usersRes = await fetch(`${USER_URL}/admin/all?limit=1000`, {
            credentials: "include",
          });
          allData.users = await usersRes.json();

          const transactionsRes = await fetch(`${TRANSACTION_URL}/yearly`, {
            credentials: "include",
          });
          allData.transactions = await transactionsRes.json();

          const categoriesRes = await fetch(`${CATEGORY_URL}/get?type=all`, {
            credentials: "include",
          });
          allData.categories = await categoriesRes.json();

          const defaultCategoriesRes = await fetch(`${DEFAULT_CATEGORY_URL}`, {
            credentials: "include",
          });
          allData.defaultCategories = await defaultCategoriesRes.json();

          data = allData;
          fileName = "all_data_export";
          title = "Complete Data Export";
          break;
        default:
          throw new Error("Invalid data type");
      }

      // Generate PDF
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

      // Add data
      doc.setFontSize(10);
      const jsonData = JSON.stringify(data, null, 2);
      const splitText = doc.splitTextToSize(jsonData, 180);
      doc.text(splitText, 14, 40);

      // Save PDF
      doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Export as JSON file
  const exportAsJson = (dataType) => {
    setIsLoading(true);
    try {
      let fileName = `${dataType}_${
        new Date().toISOString().split("T")[0]
      }.json`;

      // Create and download JSON file
      const dataStr = JSON.stringify(stats, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported as JSON successfully");
    } catch (error) {
      console.error("JSON export failed:", error);
      toast.error("Export failed: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.contentCard}>
      <Card.Header
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--light-grey)",
        }}
      >
        <h5
          className="mb-0"
          style={{ color: "var(--light)" }}
          data-cy="db-export-title"
        >
          <FontAwesomeIcon icon={faServer} className="me-2" />
          Data Statistics & Export
        </h5>
      </Card.Header>
      <Card.Body>
        <div className={styles.healthMetrics}>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Users
              <Badge bg="info" className="ms-2">
                {stats.data.totalUsers.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("users")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Transactions
              <Badge bg="info" className="ms-2">
                {stats.data.totalTransactions.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("transactions")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Categories
              <Badge bg="info" className="ms-2">
                {stats.data.totalCategories.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("categories")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Default Categories
              <Badge bg="info" className="ms-2">
                {stats.data.totalDefaultCategories.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("defaultCategories")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Expenses
              <Badge bg="info" className="ms-2">
                {stats.data.totalExpenses.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("expenses")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>
              Incomes
              <Badge bg="info" className="ms-2">
                {stats.data.totalIncomes.length}
              </Badge>
            </span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("incomes")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>All Data</span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("all")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export All
              </Button>
            </span>
          </div>

          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>JSON Export</span>
            <span>
              <Button
                variant="secondary"
                onClick={() => exportAsJson("stats")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export as JSON
              </Button>
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminDbExport;
