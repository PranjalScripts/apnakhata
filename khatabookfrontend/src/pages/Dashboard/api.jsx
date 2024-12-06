export const fetchAllTransactions = async () => {
  const token = localStorage.getItem("token");

  const [clientTransactionsRes, transactionsRes] = await Promise.all([
    fetch("http://localhost:5100/api/collab-transactions/client-transactions", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("http://localhost:5100/api/collab-transactions/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const clientTransactions = await clientTransactionsRes.json();
  const transactions = await transactionsRes.json();

  const mapTransaction = (transaction, source) => {
    const confirmedYouWillGet = transaction.transactionHistory
      .filter(
        (t) =>
          t.transactionType === "you will get" &&
          t.confirmationStatus === "confirmed"
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const confirmedYouWillGive = transaction.transactionHistory
      .filter(
        (t) =>
          t.transactionType === "you will give" &&
          t.confirmationStatus === "confirmed"
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      ...transaction,
      confirmedYouWillGet,
      confirmedYouWillGive,
      source,
    };
  };

  const clientTransactionsWithSource = (
    clientTransactions.transactions || []
  ).map((transaction) => mapTransaction(transaction, "client"));

  const transactionsWithSource = (transactions.transactions || []).map(
    (transaction) => mapTransaction(transaction, "transaction")
  );

  return [...clientTransactionsWithSource, ...transactionsWithSource];
};
