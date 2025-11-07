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

const MemberReport = ({ title, userTypeFilter }) => {
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
            const filtered = res.data.filter(
              (user) => user.user_member_type == userTypeFilter
            );
            setMember(filtered);
            setFilteredMember(filtered);
          }
        }
      } catch (error) {
        console.error("Failed to fetch member report:", error);
      }
    };

    getReport();
  }, []);

  const handleFilterChange = (value) => {
    if (value == "all") {
      setFilteredMember(member);
    } else {
      setFilteredMember(member.filter((item) => item.is_active === value));
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
          <div className="flex  items-center gap-2">
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={handleFilterChange}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
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
                <h2>Total:{member.length || 0}</h2>
              </div>
              <table
                className="w-full border rounded-md table-fixed text-[14px]"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left w-[120px]">Image</th>
                    <th className="py-2 text-left w-[50px]">MID</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left w-[120px]">DOB</th>
                    <th className="px-3 py-2 text-center w-[180px]">Email</th>
                    <th className="px-3 py-2 text-center w-[100px]">Mobile</th>
                    <th className="px-3 py-2 text-center w-[100px]">
                      Whatsapp
                    </th>
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
                          item.is_active == "inactive"
                            ? "#ffe5e5"
                            : "transparent",
                      }}
                    >
                      <td className="px-3 py-2 flex gap-2">
                        {/* User Image */}
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
                        {item.user_member_type == "Couple Membership" && (
                          <div className="w-[40px] h-[40px] rounded overflow-hidden">
                            <Image
                              width={40}
                              height={40}
                              src={`${imageBaseUrl}${item.spouse_image}`}
                              fallback={noImageUrl}
                              alt="Spouse"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        )}
                      </td>

                      <td className="py-2 font-medium break-words">
                        {item.user_mid}
                      </td>
                      <td className="px-3 py-2 font-medium break-words whitespace-pre-wrap min-w-0">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 break-words whitespace-pre-wrap min-w-0">
                        {item.user_dob
                          ? dayjs(item.user_dob).format("DD-MMM-YYYY")
                          : ""}
                      </td>
                      <td className="px-3 py-2 text-center break-words whitespace-pre-wrap min-w-0">
                        {item.email}
                      </td>
                      <td className="px-3 py-2 text-center">{item.mobile}</td>

                      <td className="px-3 py-2 text-center">
                        {item.user_whatsapp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="text-center text-gray-500 py-20">
              No data found.
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
export default MemberReport;
