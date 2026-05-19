import * as XLSX from "xlsx";

const generateExcel = (
  data,
  fileName = "Report"
) => {
  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sheet1"
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );
};

export default generateExcel;