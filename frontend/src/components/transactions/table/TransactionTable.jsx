import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { openTransactionModal } from 'services/reducers/uiSlice';
import { ITEMS_PER_PAGE, TABLE_COLORS } from 'config/transactionsConfig';

import { format } from 'date-fns';
import TableHeader from './TableHeader';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import TableTitles from './TableTitles';
import { useDeleteTransactionMutation } from 'services/api/transactionsApi';

import PaginationPages from '../pagination';
import TableItem from './TableItem';
import './TransactionTable.css';

const TransactionsTable = ({ monthData, type }) => {
  const dispatch = useDispatch();
  const { transactions, total } = monthData;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteTransaction] = useDeleteTransactionMutation();

  // Sorting By Date and Amount
  const filteredAndSortedItems = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [transactions, sortConfig]);

  // Items Per Page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedItems, currentPage]);
  const categoryColors = transactions.reduce((acc, item) => {
    const categoryName = item.category; // directly use category since it's a string
    if (categoryName && !acc[categoryName]) {
      acc[categoryName] =
        TABLE_COLORS[Object.keys(acc).length % TABLE_COLORS.length];
    }
    return acc;
  }, {});

  // Pagination Page Number
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = useCallback(
    (action, item = null) => {
      if (action === "add") {
        dispatch(openTransactionModal({ type: "add", isOpen: true }));
      } else if (action === "edit" && item) {
        dispatch(
          openTransactionModal({
            type: "edit",
            editItem: item,
            isOpen: true,
          })
        );
      }
    },
    [dispatch]
  );
  const handleExport = useCallback(() => {
    const csvContent = transactions
      .map((item) =>
        [
          item.name,
          item.amount,
          item.category,
          format(new Date(item.date), "yyyy-MM-dd"),
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([`Name,Amount,Category,Date\n${csvContent}`], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_transactions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [transactions, type]);

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids) => {
    const isBulk = Array.isArray(selectedItems) && ids.length > 1;

    try {
      const { isConfirmed } = await Swal.fire({
        title: isBulk ? `Delete ${ids.length} items?` : `Delete ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: isBulk ? "Delete All" : "Delete",
      });

      if (!isConfirmed) return;

      if (isBulk) {
        await Promise.all(
          ids.map((id) => deleteTransaction({ id, type }).unwrap())
        );
        setSelectedItems([]);
        toast.success(`Deleted ${ids.length} items`);
      } else {
        await deleteTransaction({ id: ids[0], type }).unwrap();
        setSelectedItems([]);
        toast.success("Transaction deleted");
      }
    } catch (error) {
      toast.error(
        isBulk ? "Failed to delete items" : "Failed to delete transaction"
      );
    }
  };
  const handleDeleteItems = () => handleDelete(selectedItems);

  return (
    <motion.div
      className="transactions-table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <TableHeader type={type} total={total} exportData={handleExport} openModal={handleOpenModal} />

      <div className="table-responsive">
        {!transactions.length ? (
          <motion.div
            data-cy="transactions-empty"
            className="transactions-empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="transactions-empty-icon">📊</div>
            <h3>No {type} yet</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
              Start tracking your {type.toLowerCase()} by adding your first transaction
            </p>
          </motion.div>
        ) : (
          <motion.table
            data-cy="transactions-table"
            className="transactions-table table-dark table-hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TableTitles
              selectedItems={selectedItems}
              onDelete={handleDeleteItems}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <tbody data-cy="transactions-body">
              {currentItems.map((item, index) => (
                <TableItem
                  key={item._id}
                  item={item}
                  selectedItems={selectedItems}
                  toggleSelection={toggleSelection}
                  categoryColors={categoryColors}
                  handleOpenModal={handleOpenModal}
                  index={index}
                />
              ))}
            </tbody>
          </motion.table>
        )}
      </div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <PaginationPages currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionsTable;
