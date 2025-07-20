import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { currentUser } from "services/reducers/userSlice";
import { useImageActionsMutation } from "services/api/userApi";
import uploadUserImg from "assets/uploadUserImg.png";
import MyButton from "components/ui/button";
import { Col, Container, Row } from "react-bootstrap";
import { THEME } from "constants/Theme";
import CloudImage from "components/ui/cloudImage";
import LoadingOverlay from "components/LoadingLayout";

const UploadImage = () => {
  const [imageState, setImageState] = useState({
    preview: "",
    data: "",
  });
  const user = useSelector(currentUser);
  const [imageActions, { isLoading }] = useImageActionsMutation();

  const handleImageAction = async (actionType, imageData = null) => {
    try {
      if (actionType === "delete") {
        setImageState({ preview: "", data: "" });
      }

      await imageActions({ image: imageData }).unwrap();

      if (actionType === "upload") {
        setImageState({ preview: "", data: "" });
      }

      toast.success(
        actionType === "delete"
          ? "Photo was deleted"
          : "Profile updated successfully"
      );
    } catch (error) {
      toast.error(error.message || `Failed to ${actionType} photo`);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageState({
      preview: URL.createObjectURL(file),
      data: "",
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImageState((prev) => ({ ...prev, data: result }));

      // Add this line to emit a custom event when data is ready
      // This will help Cypress know when the async operation is complete
      if (window && typeof window.Cypress !== "undefined") {
        window.dispatchEvent(new CustomEvent("fileReaderComplete"));
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    URL.revokeObjectURL(imageState.preview);
    setImageState({ preview: "", data: "" });
  };

  const ImageContainer = () => (
    <div
      className="w-100 h-100 overflow-hidden rounded"
      style={{ backgroundColor: THEME.dark, minHeight: "200px" }}
    >
      {user.imageUrl && !imageState.preview ? (
        <CloudImage
          data-cy="profile-image"
          publicId={user.imageUrl}
          width={"100%"}
          height={"100%"}
          alt="profile"
        />
      ) : imageState.preview ? (
        <img
          data-cy="preview-image"
          src={imageState.preview}
          alt="Preview"
          className="w-100 h-100 object-fit-cover"
        />
      ) : (
        <img
          data-cy="default-profile"
          src={uploadUserImg}
          alt="Upload"
          className="w-100 h-100 object-fit-cover"
        />
      )}
    </div>
  );

  const ActionButtons = () => (
    <div data-cy="action-buttons" className="d-flex gap-3">
      {imageState.preview ? (
        <>
          <MyButton
            dataCy="save-image-button"
            ariaLabel="Save Image"
            bgColor={THEME.orange}
            onClick={() =>
              imageState.data && handleImageAction("upload", imageState.data)
            }
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
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload
          </MyButton>
          {user.imageUrl && (
            <MyButton
              dataCy="delete-image-button"
              ariaLabel="Delete Image"
              bgColor="red"
              size="sm"
              onClick={() => handleImageAction("delete", null)}
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
      <Container
        fluid
        data-cy="uploadImage-container"
        className="bg-dark border border-1 border-secondary rounded p-3"
      >
        <Row className="gy-4">
          <Col xs={12} md={6}>
            <div className="d-flex flex-column align-items-center">
              <div
                className="position-relative mb-3"
                style={{
                  width: "200px",
                  height: "200px",
                  maxWidth: "100%",
                  aspectRatio: "1/1",
                }}
              >
                <ImageContainer />
              </div>
              <ActionButtons />
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="h-100 d-flex flex-column justify-content-between">
              <div
                data-cy="uploadImage-user-info"
                className="text-center text-md-start"
              >
                <h2 className="text-white h3 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-light mb-3 opacity-75">{user.email}</p>
              </div>
              <div
                data-cy="user-subscription"
                className="d-flex justify-content-center  align-items-center gap-2"
              >
                <span className="text-light">Subscription:</span>
                <span className="badge bg-primary px-3">
                  {user.subscription}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
};
export default UploadImage;
