import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faFileAlt,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../pages/admin/AdminPages.module.css";

import toast from "react-hot-toast";
import { getPDF } from "../../utils/exportPDF";

const AdminDbExport = ({ stats }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Export data function
  const exportData = async (dataType) => {
    setIsLoading(true);

    try {
      await getPDF(dataType, stats.data);
      toast.success(`${dataType} data exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
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
          {/* Individual data types */}
          {[
            {
              key: "users",
              label: "Users",
              count: stats.data.usersCount,
              icon: faFileCsv,
            },
            {
              key: "transactions",
              label: "Transactions",
              count: stats.data.transactionsCount,
              icon: faFileCsv,
            },
            {
              key: "categories",
              label: "Categories",
              count: stats.data.categoriesCount,
              icon: faFileCsv,
            },
            {
              key: "defaultCategories",
              label: "Default Categories",
              count: stats.data.defaultCategoriesCount,
              icon: faFileCsv,
            },
            {
              key: "expenses",
              label: "Expenses",
              count: stats.data.expensesCount,
              icon: faFileAlt,
            },
            {
              key: "incomes",
              label: "Incomes",
              count: stats.data.incomesCount,
              icon: faFileAlt,
            },
          ].map((item) => (
            <div className={styles.healthItem} key={item.key}>
              <span className={styles.healthLabel}>
                {item.label}
                <Badge bg="info" className="ms-2">
                  <span className="text-dark fw-bold fs-6">{item.count}</span>
                </Badge>
              </span>
              <span>
                <Button
                  variant="primary"
                  onClick={() => exportData(item.key)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  Export
                </Button>
              </span>
            </div>
          ))}

          {/* Special export options */}
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>All Data</span>
            <span>
              <Button
                variant="primary"
                onClick={() => exportData("all")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Export All
              </Button>
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminDbExport;
