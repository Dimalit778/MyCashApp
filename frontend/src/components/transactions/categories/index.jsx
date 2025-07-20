import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/ui/icon";
import MyButton from "components/ui/button";
import "./categoriesStyle.css";

import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from "services/api/categoriesApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { THEME } from "constants/Theme";
import Capitalize from "utils/Capitalize";
import { useForm } from "react-hook-form";
import TextInput from "components/ui/textInput";
import { Form } from "react-bootstrap";

const Categories = ({ categories, max }) => {
  const { type } = useParams();
  const formRef = useRef(null);

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      categoryName: "",
    },
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        reset();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reset]);
  const onSubmit = async (data) => {
    try {
      await addCategory({ categoryName: data.categoryName, type }).unwrap();
      reset();
      toast.success("Category added successfully");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Delete Category?",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteCategory({ id }).unwrap();
        toast.success("Category deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.data.message);
      return false;
    }
  };

  return (
    <div className="my-card bg-dark ">
      <div className="d-flex justify-content-between align-items-center mb-4 ">
        <p data-cy="categories-title" className="fw-bold fs-5">
          {Capitalize(type)} Categories
        </p>

        <p
          data-cy="categories-max"
          className="px-2 bg-secondary rounded fw-bold fs-6"
        >
          {categories?.length} / {max}
        </p>
      </div>

      <div className="my-card-body">
        <div
          data-cy="categories-list"
          className="d-grid gap-2"
          style={{
            gridTemplateColumns:
              categories?.length > 5 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {categories?.map((category) => (
            <div
              data-cy="category-item"
              key={category._id}
              className="my-card-item"
            >
              <span data-cy="category-name">{category.name}</span>

              <IconButton
                data-cy="delete-category-btn"
                ariaLabel="Delete Category"
                onClick={() => handleDelete(category._id)}
                icon={<FontAwesomeIcon icon={faXmark} />}
                color="red"
                size="lg"
                hoverBgColor="rgba(60, 60, 60, 0.8)"
              />
            </div>
          ))}
        </div>

        {categories?.length < max && (
          <Form
            data-cy="category-form"
            noValidate
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-3"
          >
            <div className="mb-3 border-bottom border-3 border-secondary"></div>
            <div className="d-flex gap-2 align-items-start">
              <div className="w-100" style={{ marginBottom: "-1rem" }}>
                <TextInput
                  data-cy="category-input"
                  name="categoryName"
                  control={control}
                  placeholder=" Add new category..."
                  className="form-input  py-2 rounded"
                  rules={{
                    required: "Category name is required",
                    minLength: {
                      value: 2,
                      message: "Category name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Category name must be at most 20 characters",
                    },
                  }}
                />
              </div>

              <MyButton
                data-cy="submit-category"
                type="submit"
                ariaLabel="Add Category"
                bgColor={THEME.dark}
                border={THEME.light}
                isLoading={isAdding || isSubmitting}
              >
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1.5rem" }} />
              </MyButton>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Categories;
