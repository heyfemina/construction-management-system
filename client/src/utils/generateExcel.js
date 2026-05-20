import * as XLSX from "xlsx";

const generateExcel = (
  data = [],
  fileName = "Report",
  columns = []
) => {
  const exportData =
    columns.length > 0
      ? data.map((row) =>
          columns.reduce((record, column) => {
            record[column.label] =
              row[column.key] ?? "";
            return record;
          }, {})
        )
      : data;

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

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
