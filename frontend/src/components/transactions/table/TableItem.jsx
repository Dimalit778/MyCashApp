import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Capitalize from 'utils/Capitalize';

const TableItem = ({ item, selectedItems, toggleSelection, categoryColors, handleOpenModal, index = 0 }) => {
  return (
    <motion.tr
      data-cy="transactions-row"
      key={item._id}
      onClick={() => handleOpenModal('edit', item)}
      className="align-middle text-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: 'easeOut',
      }}
      whileHover={{ backgroundColor: 'rgba(255, 140, 0, 0.05)' }}
      style={{ cursor: 'pointer' }}
    >
      <td style={{ width: '20%', textAlign: 'left' }}>
        <strong>{Capitalize(item.description)}</strong>
      </td>

      <td>
        <strong style={{ color: '#ff8c00' }}>${item.amount.toLocaleString()}</strong>
      </td>
      <td>
        <div className="d-flex justify-content-center">
          <span
            className={`badge bg-${categoryColors[item.category] || 'secondary'}`}
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              width: 'auto',
              minWidth: '100px',
              display: 'inline-block',
              textTransform: 'capitalize',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              borderRadius: '20px',
              letterSpacing: '0.02em',
            }}
          >
            {item.category}
          </span>
        </div>
      </td>

      <td>{format(new Date(item.date), 'MMM dd, yyyy')}</td>
      <td className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="form-check d-flex justify-content-center">
          <input
            className="form-check-input bg-secondary"
            type="checkbox"
            checked={selectedItems.includes(item._id)}
            onChange={() => toggleSelection(item._id)}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: 'pointer',
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '3px',
            }}
          />
        </div>
      </td>
    </motion.tr>
  );
};

export default TableItem;
