import { Card, Badge, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCalendarAlt,
  faMoneyBillWave,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "utils/formats";
import CloudImage from "components/ui/cloudImage";

const ProfileCard = ({ userData }) => {
  return (
    <Card
      style={{
        backgroundColor: "var(--dark-bg)",
        border: "1px solid var(--light-grey)",
      }}
      className="h-100"
    >
      <Card.Body className="p-3 p-md-4">
        <Container fluid className="px-0">
          <Row className="justify-content-center text-center mb-3 mb-md-4">
            <Col xs={12}>
              <div
                className="d-flex flex-column align-items-center"
                data-cy="user-profile-image"
              >
                <CloudImage
                  publicId={userData?.user?.imageUrl}
                  className="mb-3 border border-1 border-light shadow rounded-4"
                  width={120}
                  height={120}
                  alt={userData?.user?.firstName}
                />
                <h3 className="fw-bold mb-2" style={{ color: "var(--light)" }}>
                  {userData?.user?.firstName} {userData?.user?.lastName}
                </h3>
                <Badge
                  bg={userData?.user?.role === "admin" ? "warning" : "primary"}
                  className="py-2 px-3 text-uppercase"
                  style={{
                    color:
                      userData?.user?.role === "admin" ? "#856404" : "#fff",
                    backgroundColor:
                      userData?.user?.role === "admin" ? "#ffe082" : undefined,
                    border:
                      userData?.user?.role === "admin"
                        ? "1px solid #ffd54f"
                        : undefined,
                  }}
                >
                  {userData?.user?.role}
                </Badge>
              </div>
            </Col>
          </Row>

          <Row className="mt-4 gy-3 gx-md-4 ">
            <Col
              xs={12}
              md={6}
              className="d-flex flex-column justify-content-center"
            >
              <div className="ms-3">
                <p
                  className="d-flex align-items-center mb-3 flex-wrap"
                  style={{ color: "var(--light)", wordBreak: "break-all" }}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="me-2"
                    fixedWidth
                  />
                  <span className="text-break">{userData?.user?.email}</span>
                </p>
                <p
                  className="d-flex align-items-center mb-3"
                  style={{ color: "var(--light)" }}
                >
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2"
                    fixedWidth
                  />
                  <span>Joined: {formatDate(userData?.user?.createdAt)}</span>
                </p>
              </div>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex flex-column justify-content-center"
            >
              <div className="ms-3">
                <p
                  className="d-flex align-items-center mb-3"
                  style={{ color: "var(--light)" }}
                >
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="me-2"
                    fixedWidth
                  />
                  <span>
                    Transactions:
                    <Badge
                      bg="light"
                      className="ms-2 px-2"
                      style={{
                        color: "var(--dark)",
                      }}
                    >
                      {userData?.stats?.transactionCount || 0}
                    </Badge>
                  </span>
                </p>
                <p
                  className="d-flex align-items-center mb-3"
                  style={{ color: "var(--light)" }}
                >
                  <FontAwesomeIcon
                    icon={faChartPie}
                    className="me-2"
                    fixedWidth
                  />
                  <span>
                    Categories:
                    <Badge
                      bg="light"
                      className="ms-2 px-2"
                      style={{
                        color: "var(--dark)",
                      }}
                    >
                      {userData?.stats?.categoryCount || 0}
                    </Badge>
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
