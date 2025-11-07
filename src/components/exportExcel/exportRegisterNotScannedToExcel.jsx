import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportRegisterNotScannedToExcel = async (
  eventSummary,
  participantData,
  title = "Event_Details_Report"
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Event Report");

  // ----- EVENT SUMMARY TITLE -----
  sheet.mergeCells(1, 1, 1, 2);
  const summaryTitle = sheet.getCell("A1");
  summaryTitle.value = title;
  summaryTitle.font = { bold: true, size: 16 };
  summaryTitle.alignment = { horizontal: "center", vertical: "middle" };
  summaryTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: eventSummary.event_status === "Active" ? "C6EFCE" : "F8D7DA",
    },
  };
  sheet.getRow(1).height = 25;

  // 👉 Spacing row
  sheet.addRow([]);

  // ----- EVENT SUMMARY ROWS -----
  const summaryRows = [
    ["Name", eventSummary.event_name ?? ""],
    ["Description", eventSummary.event_description ?? ""],
    ["Member Allowed", eventSummary.event_member_allowed ?? ""],
    ["No. of Member Allowed", eventSummary.event_no_member_allowed ?? ""],
    [
      "From Date",
      eventSummary.event_from_date
        ? dayjs(eventSummary.event_from_date).format("DD-MMM-YYYY")
        : "-",
    ],
    [
      "To Date",
      eventSummary.event_to_date
        ? dayjs(eventSummary.event_to_date).format("DD-MMM-YYYY")
        : "-",
    ],
    ["Payment", eventSummary.event_payment === "Yes" ? "Yes" : "No"],
  ];

  // 👉 Only add Amount row if payment is Yes
  if (eventSummary.event_payment === "Yes") {
    summaryRows.push(["Amount", eventSummary.event_amount ?? ""]);
  }

  summaryRows.push(["Status", eventSummary.event_status ?? ""]);

  sheet.addRows(summaryRows);

  // 👉 Keep summary area in 2 columns only
  sheet.getColumn(1).width = 25;
  sheet.getColumn(2).width = 50;
  sheet.getColumn(1).font = { bold: true };

  // 👉 Add spacing rows before participant table
  sheet.addRow([]);
  sheet.addRow([]);

  // ----- PARTICIPANT TABLE HEADER -----
  const tableHeader = [
    "MID",
    "Payment Type",
    "Transaction",
    // "No. of People",
    "Name",
    "Mobile",
    "Member Type",
  ];

  const headerRow = sheet.addRow(tableHeader);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "f3f4f6" },
  };
  headerRow.height = 20;

  // 👉 Reset columns for table separately
  sheet.columns = [
    { key: "mid", width: 30 },
    { key: "payment", width: 30 },
    { key: "txn", width: 22 },
    // { key: "people", width: 15 },
    { key: "name", width: 25 },
    { key: "mobile", width: 18 },
    { key: "type", width: 18 },
  ];

  // ----- PARTICIPANT DATA -----
  participantData.forEach((item) => {
    sheet.addRow({
      mid: item.event_register_mid,
      payment: item.event_register_payment_type,
      txn: item.event_register_transaction,
      // people: item.event_no_of_people,
      name: item.name,
      mobile: item.mobile,
      type: item.user_member_type,
    });
  });

  // ----- EXPORT -----
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title}.xlsx`);
};
