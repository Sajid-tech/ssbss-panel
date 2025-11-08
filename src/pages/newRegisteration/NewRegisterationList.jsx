import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CONVERT_NEW_REGISTRATION_TO_MEMEBER,
  REGESTRATION_DATA,
} from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import SGSTable from "../../components/STTable/STTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useSelector } from "react-redux";

const { Search } = Input;

const highlightMatch = (text, match) => {
  if (!match || !text) return text;
  const regex = new RegExp(`(${match})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === match.toLowerCase() ? (
      <mark
        key={index}
        style={{
          backgroundColor: "#3B82F6",
          color: "#fff",
          padding: "0 2px",
          borderRadius: "4px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const NewRegisterationList = () => {
  const userType = useSelector((state) => state.auth?.user?.user_type);
  const { message } = App.useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  
  const navigate = useNavigate();

  const fetchUser = async () => {
    const res = await trigger({
      url: REGESTRATION_DATA,
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);

      
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (record) => {
    navigate(`/new-registration-form/${record.id}`);
  };

  const handleDelete = async (user) => {
    try {
      const res = await trigger({
        url: `${REGESTRATION_DATA}/${user.id}`,
        method: "delete",
      });

      if (res?.code === 201) {
        message.success(res.message || "Deleted user successfully.");
        fetchUser();
      } else {
        message.error(res.message || "Failed to delete user.");
      }
    } catch (error) {
      message.error(error.message || "Error deleting user.");
    }
  };

  const getDynamicColumns = (data) => {
    if (!data.length) return [];

    const availableKeys = Object.keys(data[0]);

    const baseColumns = [
      {
        title: "Event Name",
        dataIndex: "event_name",
        key: "event_name",
        render: (_, record) => highlightMatch(record.event_name, record._match),
      },
      {
        title: "Name",
        dataIndex: "event_register_name",
        key: "event_register_name",
        render: (_, record) =>
          highlightMatch(record.event_register_name, record._match),
      },
      {
        title: "Mobile",
        dataIndex: "event_register_mobile",
        key: "event_register_mobile",
        render: (_, record) => (
          <a href={`tel:${record.event_register_mobile}`} className="heading">
            {highlightMatch(record.event_register_mobile, record._match)}
          </a>
        ),
      },
      {
        title: "Email",
        dataIndex: "event_register_email",
        key: "event_register_email",
        render: (_, record) =>
          highlightMatch(record.event_register_email, record._match),
      },
      {
        title: "Amount",
        dataIndex: "event_register_amount",
        key: "event_register_amount",
        render: (_, record) => `₹${record.event_register_amount}`,
      },
      {
        title: "Member ID",
        dataIndex: "event_register_mid",
        key: "event_register_mid",
        render: (value) => value || "-",
      },
      {
        title: "Payment Type",
        dataIndex: "event_register_payment_type",
        key: "event_register_payment_type",
        render: (value) => value || "-",
      },
      {
        title: "Transaction ID",
        dataIndex: "event_register_transaction",
        key: "event_register_transaction",
        render: (value) => value || "-",
      },
      {
        title: "Register Date",
        dataIndex: "event_register_date",
        key: "event_register_date",
        render: (_, record) =>
          dayjs(record.event_register_date).format("DD-MM-YYYY"),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit Registration">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            {(userType == "3" || userType == "4") && (
              <Tooltip title="Delete Registration">
                <Popconfirm
                  title="Are you sure you want to delete this registration?"
                  onConfirm={() => handleDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    type="primary"
                    danger
                  />
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        ),
        width: 130,
      },
    ];

    return baseColumns.filter(
      (col) =>
        availableKeys.includes(col.dataIndex) ||
        ["actions"].includes(col.key)
    );
  };

  const filteredUsers = users
    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();

      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  const columns = getDynamicColumns(users);

  return (
    <Card
      title={
        <h2 className="text-2xl font-bold heading">Event Registration List</h2>
      }
      extra={
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
      }
    >
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <SGSTable data={filteredUsers} columns={columns} />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default NewRegisterationList;