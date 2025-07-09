export async function getPDF(dataType, data) {
  console.log("dataType", dataType);
  console.log("data", data);
  if (dataType === "users") {
    return exportUsersAsCSV(data.users);
  } else if (dataType === "transactions") {
    return exportTransactionsAsCSV(data.transactions);
  } else if (dataType === "categories") {
    return exportCategoriesAsCSV(data.categories);
  } else {
    return exportAsJSON(dataType, data);
  }
}

function exportUsersAsCSV(users) {
  // Define CSV headers
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Role",
    "Subscription",
    "Created At",
  ];

  // Convert user data to CSV rows
  const rows = users.map((user) => [
    user.id,
    user.firstName || "",
    user.lastName || "",
    user.email || "",
    user.role || "",
    user.subscription || "",
    new Date(user.createdAt).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const fileName = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csvContent, fileName, "text/csv");

  return users;
}

function exportTransactionsAsCSV(transactions) {
  // Define CSV headers
  const headers = [
    "ID",
    "Title",
    "Amount",
    "Type",
    "Category",
    "Date",
    "User ID",
  ];

  // Convert transaction data to CSV rows
  const rows = transactions.map((transaction) => [
    transaction.id,
    transaction.title || "",
    transaction.amount || 0,
    transaction.type || "",
    transaction.category?.name || "",
    new Date(transaction.date).toLocaleDateString(),
    transaction.userId || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const fileName = `transactions_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  downloadFile(csvContent, fileName, "text/csv");

  return transactions;
}

function exportCategoriesAsCSV(categories) {
  // Define CSV headers
  const headers = ["ID", "Name", "Type", "Icon", "User ID"];

  // Convert categories data to CSV rows
  const rows = categories.map((category) => [
    category.id,
    category.name || "",
    category.type || "",
    category.icon || "",
    category.userId || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const fileName = `categories_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  downloadFile(csvContent, fileName, "text/csv");

  return categories;
}

function exportAsJSON(dataType, data) {
  let fileName = `${dataType}_${new Date().toISOString().split("T")[0]}.json`;

  // Create and download JSON file
  const dataStr = JSON.stringify(data, null, 2);
  downloadFile(dataStr, fileName, "application/json");

  return data;
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
