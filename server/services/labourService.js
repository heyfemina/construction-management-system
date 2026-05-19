export const createLabourService =
  async (labourData) => {
    return {
      ...labourData,
      created_at: new Date(),
    };
  };

export const calculateWages = (
  totalDays,
  ratePerDay
) => {
  return totalDays * ratePerDay;
};