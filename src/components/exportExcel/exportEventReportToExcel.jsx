import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportEventReportToExcel = async (data, title = "Report") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Define columns
  const columns = [
    { header: "Name", key: "event_name", width: 25 },
    { header: "Allowed", key: "event_member_allowed", width: 25 },
    { header: "No of Member", key: "event_no_member_allowed", width: 25 },
    { header: "From Date", key: "event_from_date", width: 25 },
    { header: "To Date", key: "event_to_date", width: 25 },
    { header: "Payment", key: "event_payment", width: 25 },
    { header: "Amount", key: "event_amount", width: 25 },
    { header: "Total", key: "total_people", width: 25 },
  ];
  worksheet.columns = columns;

  const columnCount = columns.length;

  // ----- TITLE ROW -----
  worksheet.mergeCells(1, 1, 1, columnCount);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle", indent: 1 };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "f3f4f6" },
  };
  worksheet.getRow(1).height = 30;

  // ----- HEADER ROW -----
  const headerRow = worksheet.getRow(2);
  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col.header;
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "f3f4f6" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle", indent: 1 };
    worksheet.getColumn(index + 1).width = col.width;
  });
  headerRow.commit();

  // ----- DATA ROWS -----
  data.forEach((item, i) => {
    const row = worksheet.getRow(i + 3);
    const isActive = item.event_status == "Active";
    row.getCell(1).value = item.event_name ?? "";
    row.getCell(2).value = item.event_member_allowed ?? "";
    row.getCell(3).value = item.event_no_member_allowed ?? "";
    row.getCell(4).value = item.event_from_date
      ? dayjs(item.event_from_date).format("DD-MMM-YYYY")
      : "";
    row.getCell(5).value = item.event_to_date
      ? dayjs(item.event_to_date).format("DD-MMM-YYYY")
      : "";
    row.getCell(6).value = item.event_payment;
    row.getCell(7).value = item.event_amount;
    row.getCell(8).value = item.total_people;

    for (let j = 1; j <= columnCount; j++) {
      const cell = row.getCell(j);
      cell.alignment = {
        vertical: "middle",
        horizontal: j === 3 ? "right" : "left",
        indent: 1,
        wrapText: true,
      };
    }

    if (isActive) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "90EE90" },
        };
      });
    }

    row.commit();
  });

  // ----- EXPORT -----
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title.replace(/\s+/g, "_")}.xlsx`);
};
