import { Card, Nav, Row, Col, Form, Button, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faFilter,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { formatAmount, formatDate } from "utils/formats";
import PaginationPages from "components/transactions/pagination";
import styles from "../adminStyles.css";

const UserTransactionsCard = ({
  transactionData,

  handleDelete,
  handleFilterChange,
  activeTab,
  selectedMonth,
  selectedYear,
  months,
  years,
  currentPage,
  handlePageChange,
}) => {
  return (
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
                  onClick={() => handleFilterChange("tab", "expenses")}
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
                  <FontAwesomeIcon icon={faArrowDown} className="me-2" />
                  Expenses
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "incomes"}
                  onClick={() => handleFilterChange("tab", "incomes")}
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
                  onChange={(e) => handleFilterChange("month", e.target.value)}
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
                  onChange={(e) => handleFilterChange("year", e.target.value)}
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
            {activeTab === "expenses" ? "Expense" : "Income"} Transactions
            {selectedMonth &&
              ` - ${months.find((m) => m.value === selectedMonth)?.label}`}
            {selectedYear && ` ${selectedYear}`}
          </h4>
          <h5 style={{ color: "var(--primary-orange)" }}>
            Total: ${formatAmount(transactionData?.total || 0)}
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
              {transactionData?.transactions &&
              transactionData.transactions.length > 0 ? (
                transactionData.transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>${formatAmount(transaction.amount)}</td>
                    <td>
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

        {/* Pagination */}
        <PaginationPages
          currentPage={currentPage}
          totalPages={transactionData?.pagination?.totalPages}
          onPageChange={handlePageChange}
        />

        {/* Transaction count info */}
        {transactionData?.pagination && (
          <div
            className="text-center mt-2"
            style={{ color: "var(--light-grey)" }}
          >
            Showing {transactionData.transactions.length} of{" "}
            {transactionData.pagination.totalTransactions} transactions
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserTransactionsCard;
