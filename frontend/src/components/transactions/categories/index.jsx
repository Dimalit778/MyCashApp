import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from 'components/ui/icon';
import MyButton from 'components/ui/button';
import './categoriesStyle.css';

import { useAddCategoryMutation, useDeleteCategoryMutation } from 'services/api/categoriesApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { THEME } from 'constants/Theme';
import Capitalize from 'utils/Capitalize';
import { useForm } from 'react-hook-form';
import TextInput from 'components/ui/textInput';
import { Form } from 'react-bootstrap';

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
      categoryName: '',
    },
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        reset();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reset]);
  const onSubmit = async (data) => {
    try {
      await addCategory({ categoryName: data.categoryName, type }).unwrap();
      reset();
      toast.success('Category added successfully');
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Category?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteCategory({ id }).unwrap();
        toast.success('Category deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.data.message);
      return false;
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      className="my-card bg-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="categories-header">
        <h3 data-cy="categories-title" className="categories-title">
          {Capitalize(type)} Categories
        </h3>

        <motion.div
          data-cy="categories-max"
          className="categories-count"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {categories?.length} / {max}
        </motion.div>
      </div>

      <div className="my-card-body">
        <motion.div
          data-cy="categories-list"
          className="categories-grid"
          style={{
            gridTemplateColumns: categories?.length > 5 ? 'repeat(2, 1fr)' : '1fr',
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {categories?.map((category, index) => (
              <motion.div
                data-cy="category-item"
                key={category._id}
                className="my-card-item"
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span data-cy="category-name" className="category-name">
                  {category.name}
                </span>

                <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    data-cy="delete-category-btn"
                    ariaLabel="Delete Category"
                    onClick={() => handleDelete(category._id)}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                    color="#ff6b6b"
                    size="lg"
                    hoverBgColor="rgba(255, 107, 107, 0.2)"
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {categories?.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No categories yet. Add your first one below!
          </motion.div>
        )}

        {categories?.length < max && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Form
              data-cy="category-form"
              noValidate
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="category-form"
            >
              <div className="d-flex gap-2 align-items-start">
                <div className="w-100" style={{ marginBottom: '-1rem' }}>
                  <TextInput
                    data-cy="category-input"
                    name="categoryName"
                    control={control}
                    placeholder="Add new category..."
                    className="form-input"
                    rules={{
                      required: 'Category name is required',
                      minLength: {
                        value: 2,
                        message: 'Category name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 20,
                        message: 'Category name must be at most 20 characters',
                      },
                    }}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <MyButton
                    data-cy="submit-category"
                    type="submit"
                    ariaLabel="Add Category"
                    bgColor={THEME.dark}
                    border={THEME.light}
                    isLoading={isAdding || isSubmitting}
                    className="add-category-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '1.5rem' }} />
                  </MyButton>
                </motion.div>
              </div>
            </Form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Categories;
