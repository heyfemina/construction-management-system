export const generatePDFReport =
  async (data) => {
    return {
      success: true,
      message: "PDF Generated",
      data,
    };
  };

export const generateExcelReport =
  async (data) => {
    return {
      success: true,
      message: "Excel Generated",
      data,
    };
  };