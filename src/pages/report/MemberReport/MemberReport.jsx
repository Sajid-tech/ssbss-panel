import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, Select, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { MEMBER_REPORT } from "../../../api";
import { exportMemberReportToExcel } from "../../../components/exportExcel/exportMemberReportToExcel";
import { downloadPDF } from "../../../components/pdfExport/pdfExport";
import { useApiMutation } from "../../../hooks/useApiMutation";
const { Option } = Select;

const MemberReport = ({ title, categoryFilter }) => {
  const memberRef = useRef(null);
  const [member, setMember] = useState([]);
  const [filteredMember, setFilteredMember] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [noImageUrl, setNoImageUrl] = useState("");
  const { trigger: fetchCategoryReport, loading: isMutating } =
    useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchCategoryReport({
          url: MEMBER_REPORT,
          method: "post",
        });

        if (res.code === 201) {
          if (Array.isArray(res.data)) {
            const images = res.image_url || [];
            const imgUrlObj = Object.fromEntries(
              images.map((i) => [i.image_for, i.image_url])
            );
            setImageBaseUrl(imgUrlObj["User"] || "");
            setNoImageUrl(imgUrlObj["No Image"] || "");
            
            // Filter by category if provided
            let filteredData = res.data;
            if (categoryFilter) {
              filteredData = res.data.filter(
                (user) => user.user_member_catg_id == categoryFilter
              );
            }
            
            setMember(filteredData);
            setFilteredMember(filteredData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch member report:", error);
      }
    };

    getReport();
  }, [categoryFilter]); 

  const handleFilterChange = (value) => {
    if (value == "all") {
      setFilteredMember(member);
    } else {
      setFilteredMember(member.filter((item) => item.user_status === value));
    }
  };
  const handlePaymentFilterChange = (value) => {
    if (value == "all") {
      setFilteredMember(member);
    } else if (value == "paid") {
      setFilteredMember(member.filter((item) => item.payment_made?.toLowerCase() === "yes"));
    } else if (value == "non-paid") {
      setFilteredMember(member.filter((item) => item.payment_made?.toLowerCase() !== "yes"));
    }
  };
  const handleIssuedFilterChange = (value) => {
    if (value == "all") {
      setFilteredMember(member);
    } else if (value == "issued") {
      setFilteredMember(member.filter((item) => item.id_card_taken?.toLowerCase() === "yes"));
    } else if (value == "non-issued") {
      setFilteredMember(member.filter((item) => item.id_card_taken?.toLowerCase() !== "yes"));
    }
  };
  const handlePrint = useReactToPrint({
    content: () => memberRef.current,
    documentTitle: `${title} Report`,
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
    <>
      <Card
        title={title || ""}
        className="shadow-md rounded-lg"
        extra={
          <div className="flex items-center gap-2">
               <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handlePaymentFilterChange}
              >
                <Option value="all">All Payment</Option>
                <Option value="paid">Paid</Option>
                <Option value="non-paid">Non-Paid</Option>
              </Select>
  
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={handleFilterChange}
            >
              <Option value="all">All</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
           
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={handleIssuedFilterChange}
            >
              <Option value="all">All Issued</Option>
              <Option value="issued">Issued</Option>
              <Option value="non-issued">Non-Issued</Option>
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
                  downloadPDF("printable-section", `${title} Report.pdf`)
                }
              />
            </Tooltip>

            <Tooltip title="Excel Report">
              <Button
                type="default"
                shape="circle"
                icon={<FileExcelOutlined />}
                onClick={() =>
                  exportMemberReportToExcel(filteredMember, `${title} Report`)
                }
              />
            </Tooltip>
          </div>
        }
      >
        <div
          id="printable-section"
          ref={memberRef}
          className="p-0 m-0 print:p-0 print:m-0 max-w-4xl mx-auto"
        >
          {isMutating ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredMember.length > 0 ? (
            <>
              <div className="flex justify-between mb-2">
                <h2 className="text-xl font-semibold">{title || ""} Report</h2>
                <h2>Total: {filteredMember.length || 0}</h2>
              </div>
              <table
  className="w-full border rounded-md text-[14px] table-auto"
  style={{ borderCollapse: "collapse" }}
>
  <thead className="bg-gray-100">
    <tr>
      <th className="px-3 py-2 text-left">Image</th>
      <th className="px-3 py-2 text-left">MID</th>
      <th className="px-3 py-2 text-left">Name</th>
      <th className="px-3 py-2 text-left">DOB</th>
      <th className="px-3 py-2 text-center">Email</th>
      <th className="px-3 py-2 text-center">Mobile</th>
      <th className="px-3 py-2 text-center">Whatsapp</th>
      <th className="px-3 py-2 text-center">Status</th>
    </tr>
  </thead>

  <tbody>
    {filteredMember.map((item) => (
      <tr
        key={item.user_mid}
        className="border-t"
        style={{
          pageBreakInside: "avoid",
          backgroundColor:
            item.user_status === "Inactive" ? "#ffe5e5" : "transparent",
        }}
      >
        <td className="px-3 py-2 flex gap-2 min-w-[70px]">
          <div className="w-[40px] h-[40px] rounded overflow-hidden">
            <Image
              width={40}
              height={40}
              src={`${imageBaseUrl}${item.user_image}`}
              fallback={noImageUrl}
              alt="User"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </td>

        <td className="py-2 font-medium break-words">{item.user_mid}</td>
        <td className="px-3 py-2 font-medium break-words">{item.name}</td>
        <td className="px-3 py-2 break-words">
          {item.user_dob ? dayjs(item.user_dob).format("DD-MMM-YYYY") : ""}
        </td>
        <td className="px-3 py-2 text-center break-words">{item.email}</td>
        <td className="px-3 py-2 text-center">{item.mobile}</td>
        <td className="px-3 py-2 text-center">{item.user_whatsapp}</td>
        <td className="px-3 py-2 text-center">{item.user_status}</td>
      </tr>
    ))}
  </tbody>
</table>


            </>
          ) : (
            <div className="text-center text-gray-500 py-20">
              No data found for {title}.
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default MemberReport;