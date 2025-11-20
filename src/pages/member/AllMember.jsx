import React, { useEffect, useState } from 'react';
import { 
  App, 
  Card, 
  Input, 
  Spin, 
  Button, 
  Popconfirm, 
  Space, 
  Tag, 
  Tooltip,
  Table,
  Tabs
} from "antd";
import { 
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApiMutation";
import CreateMember from './CreateMember';

const { Search } = Input;
const { TabPane } = Tabs;

const AllMember = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // Default to "all" tab
  const [paymentFilter, setPaymentFilter] = useState("all"); // all, paid, non-paid

  // Fetch all members
  const fetchUser = async () => {
    try {
      const res = await trigger({
        url: "https://agsdemo.in/ssbssapi/public/api/member",
      });
      
      if (Array.isArray(res.data)) {
        setUsers(res.data);

        const userImageObj = res.image_url?.find(
          (img) => img.image_for === "User"
        );
        const noImageObj = res.image_url?.find(
          (img) => img.image_for === "No Image"
        );

        setImageUrls({
          userImageBase: userImageObj?.image_url || "",
          noImage: noImageObj?.image_url || "",
        });
        setImagesLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Failed to fetch members");
    }
  };

  // Fetch member categories
  const fetchCategories = async () => {
    try {
      const res = await trigger({
        url: "https://agsdemo.in/ssbssapi/public/api/panel-fetch-member-category",
      });
      
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  // Toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.user_status === "Active" ? "Inactive" : "Active";
      const res = await trigger({
        url: `https://agsdemo.in/ssbssapi/public/api/members/${user.id}/status`,
        method: "PATCH",
        data: { user_status: newStatus },
      });

      if (res?.code === 201 || res?.success) {
        message.success(
          res.message || `User marked as ${newStatus}`
        );
        fetchUser(); // Refresh the list
      } else {
        message.error(res.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.message || "Error updating user status.");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    navigate(`/members/edit/${user.id}`);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPaymentFilter("all"); // Reset payment filter when tab changes
  };

  // Handle payment filter change
  const handlePaymentFilter = (filter) => {
    setPaymentFilter(filter);
  };

  // Highlight search matches
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

  // Avatar component with better error handling
  const AvatarCell = ({ imageSrc, alt = "Avatar" }) => {
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(true);

    return (
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
        {loading && !imgError && (
          <Spin size="small" />
        )}
        <img
          src={imgError ? imageUrls.noImage : imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${loading ? 'hidden' : 'block'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setImgError(true);
          }}
        />
      </div>
    );
  };

  // Filter users based on active tab, payment filter and search term
  const getFilteredUsers = () => {
    let filteredByCategory = users;

    // Filter by category if a specific tab is selected (not "all")
    if (activeTab !== "all") {
      filteredByCategory = users.filter(user => 
        user.user_member_catg_id?.toString() === activeTab
      );
    }

    // Filter by payment status
    let filteredByPayment = filteredByCategory;
    if (paymentFilter !== "all") {
      filteredByPayment = filteredByCategory.filter(user => {
        if (paymentFilter === "paid") {
          return user.payment_made?.toLowerCase() === "yes";
        } else if (paymentFilter === "non-paid") {
          return user.payment_made?.toLowerCase() !== "yes";
        }
        return true;
      });
    }

    // Then filter by search term
    return filteredByPayment
      .map((user) => {
        const flatString = Object.values(user)
          .filter((v) => typeof v === "string" || typeof v === "number")
          .join(" ")
          .toLowerCase();
        const matched = flatString.includes(searchTerm.toLowerCase());
        return matched ? { ...user, _match: searchTerm } : null;
      })
      .filter(Boolean);
  };

  const filteredUsers = getFilteredUsers();

  // Get counts for payment filter buttons
  const getPaymentCounts = () => {
    let categoryUsers = users;
    
    if (activeTab !== "all") {
      categoryUsers = users.filter(user => 
        user.user_member_catg_id?.toString() === activeTab
      );
    }

    const paidCount = categoryUsers.filter(user => 
      user.payment_made?.toLowerCase() === "yes"
    ).length;

    const nonPaidCount = categoryUsers.filter(user => 
      user.payment_made?.toLowerCase() !== "yes"
    ).length;

    return { paidCount, nonPaidCount };
  };

  const { paidCount, nonPaidCount } = getPaymentCounts();

  // Table columns
  const columns = [
    {
      title: "Avatar",
      key: "user_image",
      render: (_, user) => {
        // Wait for imageUrls to be populated
        if (!imagesLoaded) {
          return (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                <Spin size="small" />
              </div>
            </div>
          );
        }

        const memberImageSrc = user.user_image
          ? `${imageUrls.userImageBase}${user.user_image}`
          : imageUrls.noImage;
        
        return (
          <div className="flex justify-center">
            <AvatarCell 
              imageSrc={memberImageSrc} 
              alt={`${user.name} avatar`}
            />
          </div>
        );
      },
      width: 80,
    },
    {
      title: "MID",
      dataIndex: "user_mid",
      key: "user_mid",
      render: (text) => highlightMatch(text, searchTerm),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => highlightMatch(text, searchTerm),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => highlightMatch(text, searchTerm),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => highlightMatch(text || "N/A", searchTerm),
    },
    {
      title: "Old Id Card",
      dataIndex: "id_card_type",
      key: "id_card_type",
      render: (text) => highlightMatch(text, searchTerm),
    },
    {
      title: "Member Category",
      dataIndex: "member_category",
      key: "member_category",
      render: (text) => highlightMatch(text, searchTerm),
    },
    {
      title: "Id Card Issued",
      dataIndex: "id_card_taken",
      key: "id_card_taken",
      render: (text) => highlightMatch(text, searchTerm),
    },
   
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      render: (_, user) => {
        const isActive = user.user_status === "Active";

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
                icon={isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                className="cursor-pointer"
              >
                {user.user_status}
              </Tag>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: "Payment",
      dataIndex: "payment_made",
      key: "payment_made",
      render: (text) => {
        const isPaid = text?.toLowerCase() === "yes";
        return (
          <Tag color={isPaid ? "green" : "red"}>
            {isPaid ? "Paid" : "Non-Paid"}
          </Tag>
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
                onClick={() => handleEdit(user)}
              />
            </Tooltip>
          </Space>
        );
      },
      width: 100,
    },
  ];

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold heading">All Members</h2>
        <CreateMember/>
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search member by MID, name, mobile, email, or category"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Tabs for member categories */}
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        type="card"
        className="mb-4"
        items={[
          {
            key: "all",
            label: "All Members",
          },
          ...categories.map(category => ({
            key: category.id.toString(),
            label: category.member_category,
          }))
        ]}
      />

      {/* Payment Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          type={paymentFilter === "all" ? "primary" : "default"}
          onClick={() => handlePaymentFilter("all")}
        >
          All ({filteredUsers.length})
        </Button>
        <Button
          type={paymentFilter === "paid" ? "primary" : "default"}
          onClick={() => handlePaymentFilter("paid")}
        >
          Paid ({paidCount})
        </Button>
        <Button
          type={paymentFilter === "non-paid" ? "primary" : "default"}
          onClick={() => handlePaymentFilter("non-paid")}
        >
          Non-Paid ({nonPaidCount})
        </Button>
      </div>

      <div className="min-h-[27rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <Table 
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} members`,
            }}
            scroll={{ x: 800 }}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">
            {users.length === 0 
              ? "No members found." 
              : activeTab === "all" 
                ? "No matching members found." 
                : "No members found in this category."
            }
          </div>
        )}
      </div>
    </Card>
  );
};

export default AllMember;