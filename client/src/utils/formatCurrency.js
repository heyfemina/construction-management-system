const formatCurrency = (amount) => {
  return `₹ ${Number(amount).toLocaleString(
    "en-IN"
  )}`;
};

export default formatCurrency;