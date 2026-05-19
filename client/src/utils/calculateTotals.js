const calculateTotals = (items, key) => {
  return items.reduce(
    (total, item) => total + Number(item[key]),
    0
  );
};

export default calculateTotals;