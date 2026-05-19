export const createVendorService =
  async (vendorData) => {
    return {
      ...vendorData,
      created_at: new Date(),
    };
  };

export const calculateVendorPending =
  (
    totalAmount,
    paidAmount
  ) => {
    return totalAmount - paidAmount;
  };