import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import STTable from "../STTable/STTable";

const MemberTable = ({ users, onEdit, imageUrls, handleToggleStatus }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          style={{
            backgroundColor: "#3B82F6",
            color: "#ffffff",
            padding: "0 0.25rem",
            borderRadius: "0.25rem",
          }}
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
      title: "",
      key: "member_images",
      render: (_, user) => {
        const memberImageSrc = user.user_image
          ? `${imageUrls.userImageBase}${user.user_image}`
          : imageUrls.noImage;
        const spouseImageSrc = user.spouse_image
          ? `${imageUrls.userImageBase}${user.spouse_image}`
          : imageUrls.noImage;

        return (
          <div className="flex justify-center gap-2">
            <AvatarCell imageSrc={memberImageSrc} />
            {user.user_member_type == "Couple Membership" && (
              <AvatarCell imageSrc={spouseImageSrc} />
            )}
          </div>
        );
      },
    },

    {
      title: "MID",
      dataIndex: "user_mid",
      key: "user_mid",
      render: (_, user) => highlightMatch(user.user_mid, user._match),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => highlightMatch(user.name, user._match),
    },

    {
      title: "DOB",
      dataIndex: "user_dob",
      key: "user_dob",
      render: (_, user) =>
        highlightMatch(dayjs(user.user_dob).format("DD-MM-YYYY"), user._match),
    },
    {
      title: "Spouse Name",
      dataIndex: "user_spouse_name",
      key: "user_spouse_name",
      render: (_, user) => highlightMatch(user.user_spouse_name, user._match),
    },

    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (_, user) => {
        const isActive = user.is_active === "active";

        return (
          <div className="flex justify-center">
            <Popconfirm
              title={`Mark member as ${isActive ? "Inactive" : "Active"}?`}
              onConfirm={() => handleToggleStatus(user)}
              okText="Yes"
              cancelText="No"
            >
              <Tag
                color={isActive ? "green" : "red"}
                icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                className="cursor-pointer"
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

export default MemberTable;
