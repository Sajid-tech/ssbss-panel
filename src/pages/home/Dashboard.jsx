import {
  CalendarOutlined,
  CrownOutlined,
  HeartOutlined,
  IdcardOutlined,
  TeamOutlined,
  UserAddOutlined,
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

  const cardItems = [
    {
      title: "New Registration",
      count: data?.totalNewRegistration || 0,
      icon: <UserAddOutlined />,
      color: "#1677ff",
      path: "/new-registration-list",
    },
    {
      title: "Member",
      count: data?.totalMember || 0,
      icon: <TeamOutlined />,
      color: "#52c41a",
      path: "",
    },
    {
      title: "Life Membership",
      count: data?.totallifemembership || 0,
      icon: <IdcardOutlined />,
      color: "#faad14",
      path: "/life-member",
    },
    {
      title: "Trustee",
      count: data?.totalTrustee || 0,
      icon: <CrownOutlined />,
      color: "#eb2f96",
      path: "/truste-member",
    },
    {
      title: "Couple Membership",
      count: data?.totalcouplemembership || 0,
      icon: <HeartOutlined />,
      color: "#13c2c2",
      path: "/couple-member",
    },
    {
      title: "Active Event",
      count: data?.totalActiveEvent || 0,
      icon: <CalendarOutlined />,
      color: "#722ed1",
      path: "/event",
    },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cardItems.map((item, index) => (
              <Card
                key={index}
                className="shadow-md rounded-xl hover:shadow-lg transition duration-300 cursor-pointer"
                styles={{
                  body: { padding: "16px" },
                }}
                onClick={() => navigate(item.path)}
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
