import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from 'components/transactions/progressBar';
import TransactionModal from 'components/transactions/TransactionModal';
import TransactionsTable from 'components/transactions/table/TransactionTable';
import CalendarMonth from 'components/transactions/calendarMonth';
import { useParams } from 'react-router-dom';

import Categories from 'components/transactions/categories';

import { useSelector } from 'react-redux';
import { selectedDateObject, transactionModal } from 'services/reducers/uiSlice';
import { useGetCategoriesQuery } from 'services/api/categoriesApi';
import { useGetMonthlyTransactionsQuery } from 'services/api/transactionsApi';
import LoadingOverlay from 'components/LoadingLayout';

import DataError from 'components/DataError';
import './TransactionsPage.css';

const Transaction = () => {
  const { type } = useParams();
  const modalState = useSelector(transactionModal);
  const dateStore = useSelector(selectedDateObject);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setDate(dateStore);
  }, [type, dateStore]);

  const {
    data: monthlyData,
    isLoading: loadingData,
    isFetching: fetchingData,
    error: monthError,
  } = useGetMonthlyTransactionsQuery({
    type,
    year: date.getFullYear(),
    month: date.getMonth(),
  });

  const {
    data: userCategories,
    isFetching: fetchingCategories,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useGetCategoriesQuery({
    type,
  });

  const transactions = monthlyData?.data?.transactions || [];
  const total = monthlyData?.data?.total || 0;
  const categories = userCategories?.data?.categories || [];
  const maxCategories = userCategories?.data?.maxCategories || 0;

  if (monthError || categoriesError) {
    return <DataError error={monthError || categoriesError} />;
  }

  const isLoading = fetchingData || fetchingCategories || loadingData || loadingCategories;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <LoadingOverlay data-cy="loading" show={isLoading}>
      <motion.div className="transactions-page" variants={containerVariants} initial="hidden" animate="visible">
        <div className="row gx-4 gy-4">
          <motion.div className="col-12 col-lg-8" variants={itemVariants}>
            <div className="transactions-left-section">
              <CalendarMonth date={date} setDate={setDate} />
              <ProgressBar data={{ transactions, total }} />
            </div>
          </motion.div>

          <motion.div className="col-12 col-lg-4" variants={itemVariants}>
            <Categories categories={categories} max={maxCategories} />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <TransactionsTable monthData={{ transactions, total }} type={type} />
        </motion.div>

        {modalState.isOpen && <TransactionModal type={type} date={date} categories={categories} />}
      </motion.div>
    </LoadingOverlay>
  );
};

export default Transaction;
