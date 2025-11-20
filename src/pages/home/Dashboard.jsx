import {
  CalendarOutlined,
  CrownOutlined,
  IdcardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { trigger, loading: isMutating } = useApiMutation();

  const fetchDashboard = async () => {
    const res = await trigger({
      url: DASHBOARD,
    });
    if (res?.code == 201) {
      setData(res);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Map category names to icons and paths
  const getCategoryConfig = (categoryName) => {
    const configMap = {
      "Founder Trustee": {
        icon: <CrownOutlined />,
        color: "#eb2f96",
        path: "/founder-trustee"
      },
      "Premier Trustee": {
        icon: <CrownOutlined />,
        color: "#722ed1",
        path: "/premier-trustee"
      },
      "Lifetime Trustee": {
        icon: <CrownOutlined />,
        color: "#faad14",
        path: "/lifetime-trustee"
      },
      "Patron Trustee": {
        icon: <CrownOutlined />,
        color: "#13c2c2",
        path: "/patron-trustee"
      },
      "Life Member": {
        icon: <IdcardOutlined />,
        color: "#52c41a",
        path: "/life-member"
      }
    };
    
    return configMap[categoryName] || {
      icon: <TeamOutlined />,
      color: "#1677ff",
      path: "/members"
    };
  };

  // Create card items from categoryCounts
  const categoryCards = data?.categoryCounts?.map(category => {
    const config = getCategoryConfig(category.member_category);
    return {
      title: category.member_category,
      count: category.user_count,
      icon: config.icon,
      color: config.color,
      path: config.path
    };
  }) || [];

  // Add Total Member card and Active Event card separately
  const allCards = [
    {
      title: "Member",
      count: data?.totalMember || 0,
      icon: <TeamOutlined />,
      color: "#1677ff",
      path: "/members",
    },
    ...categoryCards,
    {
      title: "Active Event",
      count: data?.totalActiveEvent || 0,
      icon: <CalendarOutlined />,
      color: "#1890ff",
      path: "/event",
    }
  ];

  return (
    <>
      {isMutating || !data ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <Title level={3}>Dashboard</Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCards.map((item, index) => (
              <Card
                key={index}
                className="shadow-md rounded-xl hover:shadow-lg transition duration-300 cursor-pointer"
                styles={{
                  body: { padding: "16px" },
                }}
                onClick={() => item.path && navigate(item.path)}
              >
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {item.icon}
                  </div>

                  <p className="text-sm font-medium text-center">
                    {item.title}
                  </p>

                  <p
                    className="text-2xl font-bold text-center"
                    style={{ color: item.color }}
                  >
                    {item.count}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;