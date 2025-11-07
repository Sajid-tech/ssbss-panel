import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Form, Select, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  EVENT,
  EVENT_NOTREGISTER_NOTSCANNED_REPORT,
  EVENT_REGISTER_NOTSCANNED_REPORT,
} from "../../../api";
import { exportEventDetailsReportToExcel } from "../../../components/exportExcel/exportEventDetailsReportToExcel";
import { downloadPDF } from "../../../components/pdfExport/pdfExport";
import { useApiMutation } from "../../../hooks/useApiMutation";
import EventCard from "../EventDetailsReport/EventCard";
import { exportNotRegisterNotScannedToExcel } from "../../../components/exportExcel/exportNotRegisterNotScannedToExcel.";
const NotRegisterNotScanned = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { trigger: submitTrigger, loading: isMutating } = useApiMutation();
  const { trigger: fetchTrigger, loading: fetchloading } = useApiMutation();
  const [eventdetails, setEventDetails] = useState([]);
  const [eventdetailsData, setEventDetailsData] = useState([]);
  const eventRef = useRef(null);
  const [EventId, setEventId] = useState([]);
  const fetchEventId = async () => {
    try {
      const event = await fetchTrigger({
        url: EVENT,
      });
      if (event?.data) {
        setEventId(event?.data || []);
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };
  useEffect(() => {
    fetchEventId();
  }, []);
  const handleSubmit = async (values) => {
    try {
      const res = await submitTrigger({
        url: EVENT_NOTREGISTER_NOTSCANNED_REPORT,
        method: "post",
        data: values,
      });
      if (res.code === 201) {
        setEventDetails(res.data);
        setEventDetailsData(res.eventData);
      }
    } catch (error) {
      console.error("Failed to fetch  report:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => eventRef.current,
    documentTitle: "Not Register Not Scanned Report",
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
      title="Not Register Not Scanned Report"
      bordered={false}
      className="shadow-md rounded-lg"
      extra={
        <div className="flex  items-center gap-2">
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
                downloadPDF(
                  "printable-section",
                  "Not_Register_Not_Scanned.pdf",
                  message
                )
              }
            />
          </Tooltip>
          <Tooltip title="Excel Report">
            <Button
              type="default"
              shape="circle"
              icon={<FileExcelOutlined />}
              onClick={() =>
                exportNotRegisterNotScannedToExcel(
                  eventdetails,
                  eventdetailsData,
                  "Not_Register_Not_Scanned"
                )
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
            label="Event"
            name="event_id"
            rules={[{ required: true, message: "Please Select Event" }]}
          >
            <Select placeholder="Select Event" allowClear>
              {EventId.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.event_name}
                </Option>
              ))}
            </Select>
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
        {isMutating || fetchloading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : eventdetails.event_name ? (
          <>
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold">
                Not Register Not Scanned Report
              </h2>
              <h2>Total:{eventdetailsData.length || 0}</h2>
            </div>
            <EventCard eventdetails={eventdetails} />
            {eventdetailsData.length > 0 ? (
              <table
                className="w-full border rounded-md table-fixed text-[14px]"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-center ">MID</th>
                    {/* <th className="px-3 py-2 text-center ">Payment Type</th>
                    <th className="px-3 py-2 text-center ">Transaction</th>
                    <th className="px-3 py-2 text-center ">No of People</th> */}
                    <th className="px-3 py-2 text-center ">Name</th>
                    <th className="px-3 py-2 text-center">Mobile</th>
                    <th className="px-3 py-2 text-center  ">Member Type</th>
                  </tr>
                </thead>

                <tbody>
                  {eventdetailsData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t"
                      style={{
                        pageBreakInside: "avoid",
                      }}
                    >
                      {" "}
                      <td className="px-3 py-2 text-center">
                        {item.event_register_mid}
                      </td>
                      {/* <td className="px-3 py-2 text-center">
                        {item.event_register_payment_type}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.event_register_transaction}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.event_no_of_people}
                      </td>{" "} */}
                      <td className="px-3 py-2 text-center">{item.name}</td>
                      <td className="px-3 py-2 text-center ">{item.mobile}</td>
                      <td className="px-3 py-2 text-center ">
                        {item.user_member_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-20"></div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default NotRegisterNotScanned;
