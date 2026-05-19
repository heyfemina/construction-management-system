const calculateTotals = (
  items,
  field
) => {
  return items.reduce(
    (total, item) =>
      total + Number(item[field] || 0),
    0
  );
};

export default calculateTotals;