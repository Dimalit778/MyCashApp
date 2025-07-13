import { Card, Badge, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "utils/formats";

const UserCategoryCard = ({ categories }) => {
  return (
    <Card
      style={{
        backgroundColor: "var(--dark-bg)",
        border: "1px solid var(--light-grey)",
        borderRadius: "10px",
      }}
    >
      <Card.Header
        style={{
          background: "var(--light-grey)",
          borderBottom: "2px solid var(--light-grey)",
        }}
      >
        <h5 className="mb-0" style={{ color: "var(--light)" }}>
          <FontAwesomeIcon icon={faChartPie} className="me-2" />
          User Categories
        </h5>
      </Card.Header>
      <Card.Body className="p-0 ">
        <div className="table-responsive">
          <Table
            hover
            className="dark-table table-dark"
            style={{
              maxHeight: "400px",
            }}
          >
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
                        bg={category.type === "expenses" ? "danger" : "success"}
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
  );
};

export default UserCategoryCard;
