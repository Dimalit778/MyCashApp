import React, { useEffect, useState } from "react";
import ProgressBar from "components/transactions/progressBar";
import TransactionModal from "components/transactions/TransactionModal";
import TransactionsTable from "components/transactions/table/TransactionTable";
import CalendarMonth from "components/transactions/calendarMonth";
import { useParams } from "react-router-dom";

import Categories from "components/transactions/categories";

import { useSelector } from "react-redux";
import {
  selectedDateObject,
  transactionModal,
} from "services/reducers/uiSlice";
import { useGetCategoriesQuery } from "services/api/categoriesApi";
import { useGetMonthlyTransactionsQuery } from "services/api/transactionsApi";
import LoadingOverlay from "components/LoadingLayout";

import DataError from "components/DataError";

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

  const isLoading =
    fetchingData || fetchingCategories || loadingData || loadingCategories;

  return (
    <LoadingOverlay data-cy="loading" show={isLoading}>
      <div>
        <div className="row mt-2 gx-5" style={{ minHeight: "45vh" }}>
          <div className="col-12 col-lg-8">
            <CalendarMonth date={date} setDate={setDate} />

            <ProgressBar data={{ transactions, total }} />
          </div>
          <div className="col-12 col-lg-4">
            <Categories categories={categories} max={maxCategories} />
          </div>
        </div>

        <TransactionsTable monthData={{ transactions, total }} type={type} />

        {modalState.isOpen && (
          <TransactionModal type={type} date={date} categories={categories} />
        )}
      </div>
    </LoadingOverlay>
  );
};

export default Transaction;
