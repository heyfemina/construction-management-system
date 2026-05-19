export const createMaterialService =
  async (materialData) => {
    return {
      ...materialData,
      created_at: new Date(),
    };
  };

export const calculateMaterialCost =
  (
    quantity,
    unitCost,
    transportCost
  ) => {
    return (
      quantity * unitCost +
      transportCost
    );
  };