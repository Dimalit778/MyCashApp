import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "react-bootstrap";
import CountUp from "react-countup";
import Capitalize from "utils/Capitalize";

const ProgressBarItem = ({ category, total, color, percentage, index }) => {
  return (
    <motion.div
      data-cy="progress-bar-item"
      className="progress-bar-item-wrapper"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="position-relative">
        <ProgressBar now={percentage} className="custom-progress bg-dark" variant={color} />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
          <div className="d-flex justify-content-between align-items-center w-100 text-style px-3">
            <span className="text-capitalize fw-bold">{Capitalize(category)}</span>
            <span data-total={total} className="fw-bold">
              <CountUp start={0} end={total} separator="," decimals={2} prefix="$" duration={1.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBarItem;
