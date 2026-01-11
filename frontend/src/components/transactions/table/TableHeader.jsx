import { faFileExport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import MyButton from 'components/ui/button';
import { THEME } from 'constants/Theme';
import React from 'react';
import CountUp from 'react-countup';
import Capitalize from 'utils/Capitalize';

const TableHeader = ({ total = 0, exportData, openModal, type }) => {
  return (
    <div className="table-header-section">
      <div className="table-actions">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <MyButton
            data-cy="add-transaction-btn"
            ariaLabel="Add Transaction"
            bgColor={THEME.dark}
            color={THEME.light}
            border={THEME.light}
            size="md"
            onClick={() => openModal('add', null)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
            New {Capitalize(type.slice(0, -1))}
          </MyButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <MyButton
            data-cy="export-transaction-btn"
            ariaLabel="Export Transaction"
            bgColor={THEME.dark}
            color={THEME.light}
            border={THEME.light}
            onClick={() => exportData()}
            size="sm"
          >
            <FontAwesomeIcon icon={faFileExport} style={{ marginRight: '0.4rem' }} />
            Export
          </MyButton>
        </motion.div>
      </div>

      <motion.div
        className="table-total-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="table-total-label">Total:</h3>
        <h3 data-cy="transaction-total-amount" className="table-total-amount">
          <CountUp start={0} end={total || 0} separator="," prefix="$" duration={2.5} decimals={2} />
        </h3>
      </motion.div>
    </div>
  );
};

export default TableHeader;
