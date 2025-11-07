import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Spin,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EVENT, EVENT_TRACK, REGESTRATION_DATA } from "../../api";
import SGSTable from "../../components/STTable/STTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import EventTrackForm from "../eventtrack/EventTrackForm";
import { useSelector } from "react-redux";
const { Search } = Input;
const EventAttendMember = () => {
  const { id } = useParams();
  const { message } = App.useApp();
  const [openDialog, setOpenDialog] = useState(false);
  const [eventId, setEventId] = useState(null);
  const userType = useSelector((state) => state.auth?.user?.user_type);
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    const res = await trigger({
      url: `${EVENT}s/${id}${REGESTRATION_DATA}`,
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
  const handleDelete = async (id) => {
    try {
      const res = await trigger({
        url: `${EVENT_TRACK}/${id}`,
        method: "DELETE",
        data: {},
      });

      if (res?.code === 201) {
        fetchUser();
        message.success(res.message || "Deleted attend member successfully.");
      } else {
        message.error(res.message || "Failed to deleted attend member.");
      }
    } catch (error) {
      message.error(error.message || "Error deleted attend member.");
    }
  };
  const columns = [
    {
      title: "Event Name",
      dataIndex: "event_name",
      key: "event_name",
      render: (_, user) => highlightMatch(user.event_name, user._match),
    },
    {
      title: "MID",
      dataIndex: "event_member_mid",
      key: "event_member_mid",
      render: (_, user) => highlightMatch(user.event_member_mid, user._match),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => highlightMatch(user.name, user._match),
    },
    {
      title: "Entry Date",
      dataIndex: "event_entry_date",
      key: "event_entry_date",
      render: (_, user) =>
        highlightMatch(
          dayjs(user.event_entry_date).format("DD-MM-YYYY"),
          user._match
        ),
    },

    {
      title: "No of People",
      dataIndex: "event_no_of_people",
      key: "event_no_of_people",
      render: (_, user) => highlightMatch(user.event_no_of_people, user._match),
    },
    {
      title: "Member Type",
      dataIndex: "user_member_type",
      key: "user_member_type",
      render: (_, user) => highlightMatch(user.user_member_type, user._match),
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
                onClick={() => handleEdit(user)}
              />
            </Tooltip>
            {(userType == "3" || userType == "4") && (
              <Tooltip title="Delete Attend Member">
                <Popconfirm
                  title="Are you sure you want to delete this attend member?"
                  onConfirm={() => handleDelete(user.id)}
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
        <h2 className="text-2xl font-bold heading">Event Attend Member</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search event"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
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
      <EventTrackForm
        open={openDialog}
        setOpenDialog={setOpenDialog}
        eventId={eventId}
        fetchEvents={fetchUser}
        EVENT_DATA={EVENT_TRACK}
      />
    </Card>
  );
};

export default EventAttendMember;
