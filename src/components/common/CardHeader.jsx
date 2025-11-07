import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CardHeader = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 bg-[#fb7c55] rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined style={{ color: "#ffffff", fontSize: 18 }} />
      </div>
      <h2 className="text-xl font-bold heading">{title}</h2>
    </div>
  );
};

export default CardHeader;
