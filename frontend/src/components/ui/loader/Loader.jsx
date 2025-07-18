import { Spinner } from "react-bootstrap";

// */ ---> Loader Spinner Animation
const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      data-cy="loading-spinner"
      style={{
        width: "100px",
        height: "100px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
};

export default Loader;
