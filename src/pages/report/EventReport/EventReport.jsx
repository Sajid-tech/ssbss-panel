import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Select,
  Spin,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { EVENT_REPORT } from "../../../api";
import { exportEventReportToExcel } from "../../../components/exportExcel/exportEventReportToExcel";
import { downloadPDF } from "../../../components/pdfExport/pdfExport";
import { useApiMutation } from "../../../hooks/useApiMutation";
const EventReport = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { trigger: submitTrigger, loading: isMutating } = useApiMutation();
  const [event, setEvent] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);
  const eventRef = useRef(null);

  const handleSubmit = async (values) => {
    const [from, to] = values?.date_range || [];

    const payload = {
      from_date: dayjs(from).format("YYYY-MM-DD"),
      to_date: dayjs(to).format("YYYY-MM-DD"),
    };
    try {
      const res = await submitTrigger({
        url: EVENT_REPORT,
        method: "post",
        data: payload,
      });
      if (res.code === 201) {
        setEvent(res.data);
        setFilteredEvent(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch Event report:", error);
    }
  };
  const handleFilterChange = (value) => {
    if (value == "all") {
      setFilteredEvent(event);
    } else {
      setFilteredEvent(event.filter((item) => item.event_status === value));
    }
  };

  const handlePrint = useReactToPrint({
    content: () => eventRef.current,
    documentTitle: "Event Report",
    pageStyle: `
       @page {
         size: auto;
         margin: 1mm;
       }
       @media print {
         body {
           margin: 0;
           padding: 2mm;
         }
         .print-hide {
           display: none;
         }
       }
     `,
  });
  return (
    <Card
      title="Event Report"
      bordered={false}
      className="shadow-md rounded-lg"
      extra={
        <div className="flex  items-center gap-2">
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={handleFilterChange}
          >
            <Option value="all">All</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>

          <Tooltip title="Print Report">
            <Button
              type="default"
              shape="circle"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            />
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button
              type="default"
              shape="circle"
              icon={<FilePdfOutlined />}
              onClick={() =>
                downloadPDF("printable-section", "Event_Report.pdf", message)
              }
            />
          </Tooltip>

          <Tooltip title="Excel Report">
            <Button
              type="default"
              shape="circle"
              icon={<FileExcelOutlined />}
              onClick={() =>
                exportEventReportToExcel(filteredEvent, "Event_Report")
              }
            />
          </Tooltip>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          date_range: [dayjs().startOf("month"), dayjs()],
        }}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label={
              <span>
                Date <span className="text-red-500">*</span>
              </span>
            }
            name="date_range"
            rules={[{ required: true, message: "Please select a date range" }]}
          >
            <DatePicker.RangePicker
              format="DD-MM-YYYY"
              className="w-full"
              placeholder={["From Date", "To Date"]}
            />
          </Form.Item>

          <div className="flex items-end">
            <Form.Item className="w-full">
              <Button
                type="primary"
                loading={isMutating}
                htmlType="submit"
                block
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
      <div
        id="printable-section"
        ref={eventRef}
        className="p-0 m-0 print:p-0 print:m-0"
      >
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredEvent.length > 0 ? (
          <>
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold">Event Report</h2>
              <h2>Total:{event.length || 0}</h2>
            </div>
            <table
              className="w-full border rounded-md table-fixed text-[14px]"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-center ">Name</th>
                  <th className="px-3 py-2 text-center ">Allowed</th>
                  <th className="px-3 py-2 text-center ">No of Member</th>
                  <th className="px-3 py-2 text-center ">From Date</th>
                  <th className="px-3 py-2 text-center ">To Date</th>
                  <th className="px-3 py-2 text-center ">Payment </th>
                  <th className="px-3 py-2 text-center">Amount</th>
                  <th className="px-3 py-2 text-center  ">Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvent.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t"
                    style={{
                      pageBreakInside: "avoid",
                      backgroundColor:
                        item.event_status == "Active"
                          ? "#90EE90"
                          : "transparent",
                    }}
                  >
                    {" "}
                    <td className="px-3 py-2 text-center">{item.event_name}</td>
                    <td className="px-3 py-2 text-center">
                      {item.event_member_allowed}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.event_no_member_allowed}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.event_from_date
                        ? dayjs(item.event_from_date).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.event_to_date
                        ? dayjs(item.event_to_date).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.event_payment}
                    </td>{" "}
                    <td className="px-3 py-2 text-center">
                      {item.event_amount}
                    </td>
                    <td className="px-3 py-2 text-center ">
                      {item.total_people}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default EventReport;
