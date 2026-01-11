import MyButton from 'components/ui/button';
import TextInput from 'components/ui/textInput';
import { THEME } from 'constants/Theme';
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation } from 'services/api/userApi';
import { currentUser } from 'services/reducers/userSlice';
import './EditProfile.css';

export default function EditProfile() {
  const userInfo = useSelector(currentUser);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,

    formState: { isDirty },
  } = useForm({
    defaultValues: {
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      currentPassword: "",
      newPassword: "",
    },
    mode: "all",
  });

  const [currentPassword, newPassword] = watch([
    "currentPassword",
    "newPassword",
  ]);

  useEffect(() => {
    reset({
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      currentPassword: "",
      newPassword: "",
    });
  }, [userInfo, reset, isEditing]);

  const onSubmit = async (data) => {
    try {
      await updateUser({
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const renderFormFields = () => (
    <>
      <Row className="edit-profile-form-section">
        <Col md={6}>
          <TextInput
            data-cy="first-name-input"
            name="firstName"
            control={control}
            label="First Name"
            disabled={!isEditing}
            rules={{
              required: {
                value: true,
                message: 'First Name is required',
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'First Name can only contain letters',
              },
            }}
          />
        </Col>
        <Col md={6}>
          <TextInput
            data-cy="last-name-input"
            name="lastName"
            type="text"
            control={control}
            label="Last Name"
            disabled={!isEditing}
            rules={{
              required: {
                value: true,
                message: 'Last Name is required',
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Last Name can only contain letters',
              },
            }}
          />
        </Col>
      </Row>

      {isEditing && (
        <Row data-cy="edit-account-form" className="edit-profile-password-section">
          <Col md={6}>
            <TextInput
              data-cy="current-password-input"
              name="currentPassword"
              control={control}
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              rules={{
                required: {
                  value: newPassword,
                  message: 'Please enter current password',
                },
              }}
            />
          </Col>
          <Col md={6}>
            <TextInput
              data-cy="new-password-input"
              name="newPassword"
              control={control}
              label="New Password"
              type="password"
              placeholder="Enter new password"
              rules={{
                required: {
                  value: currentPassword,
                  message: 'Please enter New password',
                },
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                validate: (value) =>
                  !value || !currentPassword || value !== currentPassword || 'New password must be different from current password',
              }}
            />
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <Container fluid data-cy="edit-profile-container" className="edit-profile-container">
      <div className="edit-profile-header">
        <h3 className="edit-profile-title">Profile Information</h3>
        <p className="edit-profile-subtitle">{isEditing ? 'Update your personal details and password' : 'View your profile information'}</p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderFormFields()}

        <div className="edit-profile-actions">
          {isEditing ? (
            <>
              <MyButton
                data-cy="profile-cancel-btn"
                ariaLabel="Cancel"
                bgColor={THEME.dark}
                color={THEME.light}
                border={THEME.light}
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                Cancel
              </MyButton>
              <MyButton
                data-cy="profile-save-btn"
                type="submit"
                ariaLabel="Save Changes"
                bgColor={THEME.dark}
                color={THEME.light}
                border={THEME.light}
                isLoading={isLoading}
                disabled={!isDirty || isLoading}
              >
                Save Changes
              </MyButton>
            </>
          ) : (
            <MyButton
              data-cy="profile-edit-btn"
              ariaLabel="Edit Profile"
              bgColor={THEME.dark}
              color={THEME.light}
              border={THEME.light}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </MyButton>
          )}
        </div>
      </Form>
    </Container>
  );
}
