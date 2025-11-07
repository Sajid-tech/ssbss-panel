import { Result, Button } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const MaintenancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Result
        icon={<ToolOutlined style={{ fontSize: "48px", color: "#faad14" }} />}
        title={
          <span className="text-2xl font-semibold text-gray-800">
            We'll Be Back Soon!
          </span>
        }
        subTitle={
          <p className="text-gray-600">
            We're currently performing scheduled maintenance. <br />
            Thank you for your patience.
          </p>
        }
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry Now
          </Button>
        }
        className="bg-white p-8 rounded-lg shadow-md"
      />
    </div>
  );
};

export default MaintenancePage;
