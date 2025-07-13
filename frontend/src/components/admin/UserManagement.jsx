import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Modal,
  Pagination,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrash,
  faEye,
  faUserShield,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";
import Loader from "components/ui/loader/Loader";
import {
  useGetAllUsersQuery,
  useAdminDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "services/api/adminApi";

import "./adminStyles.css";
import CloudImage from "components/ui/cloudImage";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    user: null,
  });

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page,
    search,
    role: roleFilter,
    limit: 10,
  });

  const [adminDeleteUser] = useAdminDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const users = data?.users || [];
  const pagination = data?.pagination || {};

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setPage(1);
  };

  const handleDeleteUser = async (user) => {
    try {
      await adminDeleteUser({ id: user._id }).unwrap();
      toast.success(
        `User ${user.firstName} ${user.lastName} deleted successfully`
      );
      setDeleteConfirm({ show: false, user: null });
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success("User role updated successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update user role");
    }
  };

  const showUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const confirmDelete = (user) => {
    setDeleteConfirm({ show: true, user });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="user-management dark-theme">
      <Card className="shadow-sm dark-card">
        <Card.Header
          className="border-bottom dark-header"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--light)",
            borderBottomColor: "var(--light-grey)",
          }}
        >
          <Row className="align-items-center g-3">
            {/* Title*/}
            <Col xs={6} md={6} lg={4}>
              <h5 className="mb-0" style={{ color: "var(--light)" }}>
                User Management
              </h5>
            </Col>

            {/* Dropdown  */}
            <Col xs={6} md={6} lg={4} className="d-flex justify-content-end">
              <Dropdown data-cy="role-filter-dropdown">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  style={{
                    backgroundColor: "var(--dark)",
                    color: "var(--light)",
                    borderColor: "var(--light-grey)",
                  }}
                >
                  {roleFilter
                    ? roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)
                    : "All Roles"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--light-grey)",
                  }}
                >
                  <Dropdown.Item
                    onClick={() => handleRoleFilter("")}
                    style={{
                      color: "var(--light)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    All Roles
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleRoleFilter("admin")}
                    style={{
                      color: "var(--light)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Admin
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleRoleFilter("user")}
                    style={{
                      color: "var(--light)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    User
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            {/* Search - Full width on small/medium, right side on large screens */}
            <Col xs={12} md={12} lg={4}>
              <InputGroup data-cy="search-users-input">
                <InputGroup.Text
                  style={{
                    backgroundColor: "var(--dark)",
                    color: "var(--light)",
                    border: "1px solid var(--light-grey)",
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={handleSearch}
                  style={{
                    backgroundColor: "var(--dark)",
                    color: "var(--light)",
                    border: "1px solid var(--light-grey)",
                  }}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0" data-cy="users-table">
          <Table hover className="mb-0 dark-table table-dark">
            <thead
              style={{
                backgroundColor: "var(--dark-bg)",
                color: "var(--light)",
              }}
            >
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="dark-row"
                  data-cy="user-row"
                  onClick={() => showUserDetails(user._id)}
                >
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td>
                    <CloudImage
                      publicId={user.imageUrl}
                      className="rounded-circle"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td>
                    <div>
                      <strong data-cy="user-name">
                        {user.firstName} {user.lastName}
                      </strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant={user.role === "admin" ? "warning" : "primary"}
                        size="sm"
                        style={{
                          backgroundColor:
                            user.role === "admin" ? "#ffc107" : "#007bff",
                          borderColor:
                            user.role === "admin" ? "#ffc107" : "#007bff",
                        }}
                      >
                        {user.role === "admin" ? (
                          <FontAwesomeIcon icon={faUserShield} />
                        ) : (
                          <FontAwesomeIcon icon={faUser} />
                        )}{" "}
                        {user.role}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dark-dropdown">
                        <Dropdown.Item
                          onClick={() => handleRoleChange(user._id, "admin")}
                          disabled={user.role === "admin"}
                        >
                          Make Admin
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleRoleChange(user._id, "user")}
                          disabled={user.role === "user"}
                        >
                          Make User
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        data-cy="user-view-btn"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => showUserDetails(user._id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Button
                        data-cy="user-delete-btn"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmDelete(user)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>

        {pagination.totalPages > 1 && (
          <Card.Footer className="dark-footer">
            <div className="d-flex justify-content-between align-items-center">
              <small style={{ color: "var(--light)" }}>
                Showing {users.length} of {pagination.totalUsers} users
              </small>
              <Pagination className="mb-0 dark-pagination">
                <Pagination.Prev
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                />
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === page}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirm.show}
        onHide={() => setDeleteConfirm({ show: false, user: null })}
        contentClassName="dark-modal"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "var(--surface)",
            borderBottomColor: "var(--light-grey)",
          }}
        >
          <Modal.Title style={{ color: "var(--light)" }}>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "var(--dark-bg)",
            color: "var(--light)",
          }}
        >
          Are you sure you want to delete user{" "}
          <strong style={{ color: "var(--primary-orange)" }}>
            {deleteConfirm.user?.firstName} {deleteConfirm.user?.lastName}
          </strong>
          ? This action will also delete all their transactions and categories
          and cannot be undone.
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "var(--surface)",
            borderTopColor: "var(--light-grey)",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, user: null })}
            style={{
              backgroundColor: "var(--light-grey)",
              borderColor: "var(--light-grey)",
              color: "var(--light)",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(deleteConfirm.user)}
            style={{
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
            }}
          >
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
