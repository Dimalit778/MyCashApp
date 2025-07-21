import appLogo from "assets/SiteIcon.png";

const BrandLogo = ({ size = "sm" }) => {
  const sizes = {
    xs: {
      imgSize: "25",
      fontSize: "1.2rem",
    },
    sm: {
      imgSize: "40",
      fontSize: "1.5rem",
    },
    md: {
      imgSize: "45",
      fontSize: "1.8rem",
    },
    lg: {
      imgSize: "55",
      fontSize: "2.1rem",
    },
  };

  const { imgSize, fontSize } = sizes[size] || sizes.md;

  return (
    <div
      data-cy="brand-logo"
      className="d-flex align-items-center justify-content-center"
    >
      <img
        width={imgSize}
        height={imgSize}
        src={appLogo}
        alt="money-bag"
        className="me-2"
      />
      <span
        className="title"
        style={{
          fontSize,
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        My
        <span
          className="cLetter"
          style={{
            color: "#ffd700",
          }}
        >
          C
        </span>
        ash
      </span>
    </div>
  );
};

export default BrandLogo;
