import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faCancel,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../pages/admin/AdminPages.module.css";
import toast from "react-hot-toast";
import {
  useGetDefaultCategoriesQuery,
  useAddDefaultCategoryMutation,
  useUpdateDefaultCategoryMutation,
  useDeleteDefaultCategoryMutation,
} from "services/api/adminApi";
import Swal from "sweetalert2";

const AdminCategories = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expenses",
    isActive: true,
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    data,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetDefaultCategoriesQuery();
  const [addDefaultCategory] = useAddDefaultCategoryMutation();
  const [updateDefaultCategory] = useUpdateDefaultCategoryMutation();
  const [deleteDefaultCategory] = useDeleteDefaultCategoryMutation();
  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      setIsLoading(false);
      return;
    }
    if (newCategory.name.length < 2) {
      toast.error("Category name must be at least 2 characters");
      setIsLoading(false);
      return;
    }
    if (newCategory.name.length > 30) {
      toast.error("Category name must be less than 30 characters");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    addDefaultCategory(newCategory)
      .unwrap()
      .then(() => {
        toast.success("Category added successfully");
        setShowAddCategoryModal(false);
        setIsLoading(false);
        setNewCategory({
          name: "",
          type: "expenses",
          isActive: true,
        });
      })
      .catch((error) => {
        toast.error(error.data.message);
        setIsLoading(false);
      });
  };

  // Handle editing a category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      type: category.type,
      isActive: category.isActive,
      _id: category._id,
    });
    setShowAddCategoryModal(true);
  };

  // Handle updating a category
  const handleUpdateCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (newCategory.name.length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }
    if (newCategory.name.length > 30) {
      toast.error("Category name must be less than 30 characters");
      return;
    }

    updateDefaultCategory(newCategory)
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully");
        setIsLoading(false);
        setShowAddCategoryModal(false);
        setNewCategory({
          name: "",
          type: "expenses",
          isActive: true,
        });
      })
      .catch((error) => {
        toast.error(error.data.message);
        setIsLoading(false);
      });
  };
  const deleteAlert = (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All your data will be deleted",
      icon: "warning",
      showCancelButton: true,
      theme: "dark",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Account",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(categoryId);
      }
    });
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteDefaultCategory(categoryId).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: "Your Account has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  // Handle toggling category active status
  const handleToggleActive = (category) => {
    console.log("category", category);
    updateDefaultCategory({ _id: category._id, isActive: !category.isActive })
      .unwrap()
      .then((res) => {
        toast.success("Category status updated successfully");
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };
  const ShowLoadingOrError = () => {
    if (isLoadingCategories) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" style={{ color: "#FF6500" }} />
        </div>
      );
    }
    if (categoriesError) {
      return (
        <div data-cy="error-message" className="text-center py-4">
          Error: {categoriesError.message}
        </div>
      );
    }
  };

  return (
    <>
      <Card className={styles.contentCard} data-cy="admin-categories-container">
        <Card.Header>
          <div className="d-flex justify-content-end align-items-center">
            <Button
              data-cy="add-category-button"
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setNewCategory({
                  name: "",
                  type: "expenses",
                  isActive: true,
                });
                setShowAddCategoryModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Add Category
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {isLoadingCategories && <ShowLoadingOrError />}
          {data && (
            <Table
              responsive
              hover
              className=" table-dark"
              data-cy="categories-table"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody data-cy="categories-body">
                {data?.map((category, index) => (
                  <tr key={category._id} data-cy="category-item">
                    <td data-cy="category-index">{index + 1}</td>
                    <td data-cy="category-name">{category.name}</td>
                    <td>
                      <Badge
                        bg={category.type === "incomes" ? "success" : "primary"}
                      >
                        {category.type === "incomes" ? "Income" : "Expense"}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={category.isActive ? "success" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          data-cy="edit-category-btn"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          data-cy="toggle-active-btn"
                          variant={
                            category.isActive
                              ? "outline-warning"
                              : "outline-success"
                          }
                          size="sm"
                          onClick={() => handleToggleActive(category)}
                        >
                          <FontAwesomeIcon
                            icon={category.isActive ? faToggleOff : faToggleOn}
                          />
                        </Button>
                        <Button
                          data-cy="delete-category-btn"
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteAlert(category._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal
        data-cy="category-modal"
        show={showAddCategoryModal}
        onHide={() => setShowAddCategoryModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--light-grey)",
          }}
        >
          <Modal.Title style={{ color: "var(--light)" }} data-cy="modal-title">
            {editingCategory ? "Edit Category" : "Add Default Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "var(--dark-bg)" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>
                Category Name
              </Form.Label>
              <Form.Control
                data-cy="category-name-input"
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "var(--light)" }}>Type</Form.Label>
              <Form.Select
                data-cy="category-type-select"
                value={newCategory.type}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, type: e.target.value })
                }
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--light)",
                  border: "1px solid var(--light-grey)",
                }}
              >
                <option value="expenses">Expense</option>
                <option value="incomes">Income</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--light-grey)",
          }}
        >
          <Button
            data-cy="cancel-category-btn"
            variant="secondary"
            onClick={() => setShowAddCategoryModal(false)}
          >
            <FontAwesomeIcon icon={faCancel} className="me-2" />
            Cancel
          </Button>
          <Button
            data-cy="save-category-btn"
            variant="primary"
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {editingCategory ? "Update" : "Add"} Category
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminCategories;
