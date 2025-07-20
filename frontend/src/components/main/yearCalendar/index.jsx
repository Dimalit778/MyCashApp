import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "components/ui/icon";
import React from "react";

const YearCalender = ({ year, setYear }) => {
  return (
    <div
      data-cy="year-calender"
      className="d-flex pt-2 justify-content-center align-items-center "
    >
      <IconButton
        data-cy="year-prev-btn"
        ariaLabel="Previous Year"
        icon={<FontAwesomeIcon icon={faAngleLeft} />}
        onClick={() => setYear((prev) => prev - 1)}
        className="border-1 border-light btn-sm me-5 bg-transparent"
      />
      <h1
        data-cy="year-display"
        className=" mb-0"
        style={{
          color: "white",
          fontSize: "3rem",
          fontFamily: "Oswald",
        }}
      >
        {year}
      </h1>
      <IconButton
        data-cy="year-next-btn"
        icon={<FontAwesomeIcon icon={faAngleRight} />}
        onClick={() => setYear((prev) => prev + 1)}
        className="border-1 border-light btn-sm ms-5 bg-transparent"
      />
    </div>
  );
};

export default YearCalender;
