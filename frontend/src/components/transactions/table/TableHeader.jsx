import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyButton from "components/ui/button";
import { THEME } from "constants/Theme";
import React from "react";
import CountUp from "react-countup";
import Capitalize from "utils/Capitalize";

const TableHeader = ({ total = 0, exportData, openModal, type }) => {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
      <div className=" d-flex justify-content-center align-items-center gap-3 ">
        <MyButton
          data-cy="add-transaction-btn"
          ariaLabel="Add Transaction"
          bgColor={THEME.dark}
          color={THEME.light}
          border={THEME.light}
          size="md"
          onClick={() => openModal("add", null)}
        >
          New {Capitalize(type.slice(0, -1))}
        </MyButton>
        <MyButton
          data-cy="export-transaction-btn"
          ariaLabel="Export Transaction"
          bgColor={THEME.dark}
          color={THEME.light}
          border={THEME.light}
          onClick={() => exportData()}
          size="sm"
        >
          <FontAwesomeIcon icon={faFileExport} />
          Export
        </MyButton>
      </div>

      <div className="d-flex align-items-center">
        <h3 className="me-3 text-secondary">Total:</h3>
        <h3 data-cy="transaction-total-amount" className="text-secondary">
          <CountUp
            start={0}
            end={total || 0}
            separator=","
            prefix="$"
            duration={2.5}
          />
        </h3>
      </div>
    </div>
  );
};

export default TableHeader;
