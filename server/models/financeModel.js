const financeModel = {
  receivablesTable: "receivables",

  paymentsTable: "payments",

  expensesTable: "expenses",

  receivablesColumns: [
    "id",
    "client_id",
    "site_id",
    "total_amount",
    "received_amount",
    "pending_amount",
    "due_date",
    "created_at",
  ],

  paymentsColumns: [
    "id",
    "client_id",
    "payment_amount",
    "payment_date",
    "payment_method",
    "notes",
    "created_at",
  ],

  expensesColumns: [
    "id",
    "site_id",
    "expense_type",
    "amount",
    "expense_date",
    "description",
    "created_at",
  ],
};

export default financeModel;