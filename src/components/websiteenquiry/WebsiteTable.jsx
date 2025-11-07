import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Image, Space, Tag, Tooltip } from "antd";
import STTable from "../STTable/STTable";

const WebsiteTable = ({ website }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          className="bg-[#006666] text-white px-1 rounded"
          style={{ backgroundColor: "#006666", color: "white" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (_, user) => highlightMatch(user.fullname, user._match),
    },
    {
      title: "Mobile",
      dataIndex: "mobile_no",
      key: "mobile_no",
      render: (_, user) => (
        <a href={`tel:${user.mobile_no}`}>
          {highlightMatch(user.mobile_no, user._match)}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email_id",
      key: "email_id",
      render: (_, user) => (
        <Tooltip title={user.email_id}>
          {highlightMatch(user.email_id, user._match)}
        </Tooltip>
      ),
    },
    {
      width: 430,
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, user) => highlightMatch(user.description, user._match),
    },
  ];

  return <STTable data={website} columns={columns} />;
};

export default WebsiteTable;
