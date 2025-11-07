import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import STTable from "../STTable/STTable";

const UserTable = ({ users, onToggleStatus, onEdit, imageUrls, type }) => {
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
      title: "Avatar",
      dataIndex: "avatar_photo",
      key: "avatar",
      render: (_, user) => (
        <div className="flex justify-center">
          <Avatar
            size={38}
            // src={
            //   user.avatar_photo
            //     ? imageUrls.userImageBase + user.avatar_photo
            //     : imageUrls.noImage
            // }
            src={
              user.avatar_photo
                ? `${imageUrls.userImageBase}${
                    user.avatar_photo
                  }?v=${Math.random()}`
                : imageUrls.noImage
            }
            icon={<UserOutlined />}
          />
        </div>
      ),
    },
    ...(type === "user"
      ? [
          {
            title: "Firm Name",
            dataIndex: "firm_name",
            key: "firm_name",
            render: (_, user) => (
              <span className="font-semibold text-[#006666]">
                {highlightMatch(user.firm_name, user._match)}
              </span>
            ),
          },
        ]
      : []),

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => highlightMatch(user.name, user._match),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (_, user) => (
        <a href={`tel:${user.mobile}`}>
          {highlightMatch(user.mobile, user._match)}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, user) => (
        <Tooltip title={user.email}>
          {highlightMatch(user.email, user._match)}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (_, user) => {
        const isActive = user.is_active === "true" || user.is_active === true;
        return (
          <div className="flex justify-center">
            <Popconfirm
              title={`Mark user as ${isActive ? "Inactive" : "Active"}?`}
              onConfirm={() => onToggleStatus(user)}
              okText="Yes"
              cancelText="No"
              className="cursor-pointer"
            >
              <Tag
                color={isActive ? "green" : "red"}
                icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              >
                {isActive ? "Active" : "Inactive"}
              </Tag>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => {
        return (
          <Space>
            <Tooltip title="Edit User">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(user)}
                className="bg-[#006666]"
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];

  return <STTable data={users} columns={columns} />;
};

export default UserTable;
