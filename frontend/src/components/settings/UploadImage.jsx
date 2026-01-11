import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { currentUser } from 'services/reducers/userSlice';
import { useImageActionsMutation } from 'services/api/userApi';
import uploadUserImg from 'assets/uploadUserImg.png';
import MyButton from 'components/ui/button';
import { Col, Container, Row } from 'react-bootstrap';
import { THEME } from 'constants/Theme';
import CloudImage from 'components/ui/cloudImage';
import LoadingOverlay from 'components/LoadingLayout';
import './UploadImage.css';

const UploadImage = () => {
  const [imageState, setImageState] = useState({
    preview: '',
    data: '',
  });
  const user = useSelector(currentUser);
  const [imageActions, { isLoading }] = useImageActionsMutation();

  const handleImageAction = async (actionType, imageData = null) => {
    try {
      if (actionType === 'delete') {
        setImageState({ preview: '', data: '' });
      }

      await imageActions({ image: imageData }).unwrap();

      if (actionType === 'upload') {
        setImageState({ preview: '', data: '' });
      }

      toast.success(actionType === 'delete' ? 'Photo was deleted' : 'Profile updated successfully');
    } catch (error) {
      toast.error(error.message || `Failed to ${actionType} photo`);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageState({
      preview: URL.createObjectURL(file),
      data: '',
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImageState((prev) => ({ ...prev, data: result }));

      // Add this line to emit a custom event when data is ready
      // This will help Cypress know when the async operation is complete
      if (window && typeof window.Cypress !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fileReaderComplete'));
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    URL.revokeObjectURL(imageState.preview);
    setImageState({ preview: '', data: '' });
  };

  const ImageContainer = () => (
    <>
      {user.imageUrl && !imageState.preview ? (
        <CloudImage data-cy="profile-image" publicId={user.imageUrl} width={'100%'} height={'100%'} alt="profile" />
      ) : imageState.preview ? (
        <img data-cy="preview-image" src={imageState.preview} alt="Preview" className="w-100 h-100 object-fit-cover" />
      ) : (
        <img data-cy="default-profile" src={uploadUserImg} alt="Upload" className="w-100 h-100 object-fit-cover" />
      )}
    </>
  );

  const ActionButtons = () => (
    <div data-cy="action-buttons" className="d-flex gap-3">
      {imageState.preview ? (
        <>
          <MyButton
            dataCy="save-image-button"
            ariaLabel="Save Image"
            bgColor={THEME.orange}
            onClick={() => imageState.data && handleImageAction('upload', imageState.data)}
          >
            Save
          </MyButton>
          <MyButton
            dataCy="cancel-image-button"
            ariaLabel="Cancel Image"
            bgColor="red"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </MyButton>
        </>
      ) : (
        <>
          <input
            data-cy="upload-image-input"
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <MyButton
            data-cy="upload-image-button"
            ariaLabel="Upload Image"
            size="sm"
            bgColor={THEME.secondary}
            onClick={() => document.getElementById('fileInput').click()}
          >
            Upload
          </MyButton>
          {user.imageUrl && (
            <MyButton
              dataCy="delete-image-button"
              ariaLabel="Delete Image"
              bgColor="red"
              size="sm"
              onClick={() => handleImageAction('delete', null)}
            >
              Delete
            </MyButton>
          )}
        </>
      )}
    </div>
  );

  return (
    <LoadingOverlay show={isLoading}>
      <Container fluid data-cy="uploadImage-container" className="upload-image-container">
        <Row className="gy-4">
          <Col xs={12} md={6}>
            <div className="upload-image-wrapper">
              <div className="upload-image-avatar-wrapper">
                <div className="upload-image-avatar">
                  <ImageContainer />
                </div>
              </div>
              <div className="upload-image-actions">
                <ActionButtons />
              </div>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="upload-image-user-info">
              <div data-cy="uploadImage-user-info" className="text-center text-md-start">
                <h2 className="upload-image-user-name">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="upload-image-user-email">{user.email}</p>
              </div>
              <div data-cy="user-subscription" className="upload-image-subscription">
                <span className="upload-image-subscription-label">Subscription:</span>
                <span className="upload-image-subscription-badge">{user.subscription}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
};
export default UploadImage;
