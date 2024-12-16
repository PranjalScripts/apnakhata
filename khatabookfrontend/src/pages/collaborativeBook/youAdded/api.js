export const fetchClients = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  if (data.success && Array.isArray(data.data)) {
    return data.data;
  } else {
    throw new Error("Unexpected response structure");
  }
};

export const fetchBooks = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  if (Array.isArray(data.books)) {
    return data.books;
  } else {
    throw new Error("Expected an array of books but got");
  }
};

export const createTransaction = async (transactionData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${process.env.REACT_APP_URL}/api/collab-transactions/create-transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }
};
