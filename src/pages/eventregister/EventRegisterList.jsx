import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EVENT_REGISTER } from "../../api";
import SGSTable from "../../components/STTable/STTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import EventRegisterForm from "./EventRegisterForm";
const { Search } = Input;
const EvenRegisterList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    const res = await trigger({
      url: EVENT_REGISTER,
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (user) => {
    setEventId(user.id);
    setOpenDialog(true);
  };

  const handleAddUser = () => {
    setEventId(null);
    setOpenDialog(true);
  };
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          style={{
            backgroundColor: "#93C5FD",
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
      title: "MID",
      dataIndex: "event_register_mid",
      key: "event_register_mid",
      render: (_, user) => highlightMatch(user.event_register_mid, user._match),
    },
    {
      title: "Name",
      dataIndex: "event_name",
      key: "event_name",
      render: (_, user) => highlightMatch(user.event_name, user._match),
    },
    {
      title: "Member Type",
      dataIndex: "user_member_type",
      key: "user_member_type",
      render: (_, user) => highlightMatch(user.user_member_type, user._match),
    },

    {
      title: "Registration Date",
      dataIndex: "event_register_date",
      key: "event_register_date",
      render: (_, user) =>
        highlightMatch(
          dayjs(user.event_register_date).format("DD-MM-YYYY"),
          user._match
        ),
    },
    {
      title: "Mobile",
      dataIndex: "event_register_mobile",
      key: "event_register_mobile",
      render: (_, user) => (
        <a href={`tel:${user.event_register_mobile}`} className="heading">
          {highlightMatch(user.event_register_mobile, user._match)}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "event_register_email",
      key: "event_register_email",
      render: (_, user) =>
        highlightMatch(user.event_register_email, user._match),
    },
    // {
    //   title: "Amount",
    //   dataIndex: "event_register_amount",
    //   key: "event_register_amount",
    //   render: (_, user) =>
    //     highlightMatch(user.event_register_amount, user._match),
    // },
    // {
    //   title: "Payment Type",
    //   dataIndex: "event_register_payment_type",
    //   key: "event_register_payment_type",
    //   render: (_, user) =>
    //     highlightMatch(user.event_register_payment_type, user._match),
    // },

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
                onClick={() => handleEdit(user)}
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];
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

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold heading">Event Register List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search event"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />

          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add Event
          </Button> */}
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <SGSTable data={users} columns={columns} />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
      <EventRegisterForm
        open={openDialog}
        setOpenDialog={setOpenDialog}
        eventId={eventId}
        fetchEvents={fetchUser}
      />
    </Card>
  );
};

export default EvenRegisterList;
