import {
  ArrowRightOutlined,
  BarChartOutlined,
  CarOutlined,
  CloseOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  ProfileOutlined,
  SolutionOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import logo1 from "../assets/logo-1.png";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useFinalUserImage from "./common/Logo";

const getMenuItems = (collapsed) => {
  // --- Common Menu Sections ---
  const eventChildren = [
    { key: "/event", icon: <SolutionOutlined />, label: "Event" },
    { key: "/event-register", icon: <TagsOutlined />, label: "Event Register" },
    { key: "/event-track", icon: <CarOutlined />, label: "Event Track" },
  ];

  const eventReportChildren = [
    { key: "/report-event", icon: <CarOutlined />, label: "Event" },
    {
      key: "/all-member-report",
      icon: <CarOutlined />,
      label: "Member",
    },
    {
      key: "/report-event-details",
      icon: <CarOutlined />,
      label: "Event Details",
    },
    {
      key: "/report-register-notscanned",
      icon: <CarOutlined />,
      label: "Registered Not Scanned",
    },
    {
      key: "/report-notregister-notscanned",
      icon: <CarOutlined />,
      label: "Not Registered Not Scanned",
    },
  ];

  const dashboardItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
    {
      key: "/new-registration-list",
      icon: <TagsOutlined />,
      label: "New Registration",
    },
    { key: "/member", icon: <LockOutlined />, label: "Member" },
  ];


  const fullReportChildren = [
  
    ...eventReportChildren,
  ];

  // --- Sidebar Structure ---
  if (collapsed) {
    return [
      ...dashboardItems,
    
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Event",
        children: eventChildren,
      },
      {
        key: "sub2",
        icon: <BarChartOutlined />,
        label: <span id="report-scroll-anchor">Report</span>,
        children: fullReportChildren,
      },
    ];
  }

  return [
    { type: "group", label: "Dashboard", children: dashboardItems },
    
    {
      type: "group",
      label: "Event",
      children: [
        {
          key: "sub1",
          icon: <MailOutlined />,
          label: "Event",
          children: eventChildren,
        },
      ],
    },
    {
      type: "group",
      label: "Report",
      children: [
        {
          key: "sub2",
          icon: <BarChartOutlined />,
          label: "Report",
          children: fullReportChildren,
        },
      ],
    },
  ];
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const location = useLocation();
  const selectedKeys = [location.pathname];
  const getOpenKeysFromPath = (path) => {
    if (path.startsWith("/report-")) return ["sub2"];
    return [];
  };

  const [openKeys, setOpenKeys] = useState(() =>
    getOpenKeysFromPath(location.pathname)
  );

  const naviagte = useNavigate();
  const items = getMenuItems(collapsed);
  const dispatch = useDispatch();
  const finalUserImage = useFinalUserImage();

  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedCollapse(collapsed);
    }, 150);
    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      })
    );
  };

  const rootSubmenuKeys = ["sub", "sub1", "sub2"];

  useEffect(() => {
    if (openKeys.includes("sub2")) {
      const anchor = document.getElementById("report-scroll-anchor");
      const scrollContainer = document.querySelector(".scrollbar-custom");

      if (anchor && scrollContainer) {
        let offset = 0;
        let el = anchor;
        while (el && el !== scrollContainer) {
          offset += el.offsetTop;
          el = el.offsetParent;
        }

        scrollContainer.scrollTo({
          top: offset - 10,
          behavior: "smooth",
        });
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: offset - 10,
            behavior: "smooth",
          });
        }, 200);
      }
    }
  }, [openKeys]);

  return (
    <motion.aside
      initial={{ width: collapsed ? 95 : 260 }}
      animate={{ width: collapsed ? 95 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      <div className="flex items-center justify-center h-14 px-4 !bg-orange-50">
        <motion.img
          src={collapsed ? logo1 : finalUserImage}
          alt="Logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`object-contain transition-all duration-300 ${
            collapsed ? "w-12" : ""
          }`}
        />

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex-1 py-2 scrollbar-custom">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find(
              (key) => openKeys.indexOf(key) === -1
            );
            if (rootSubmenuKeys.includes(latestOpenKey)) {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            } else {
              setOpenKeys(keys);
            }
          }}
          onClick={({ key, keyPath }) => {
            if (isMobile && onClose) onClose();
            if (keyPath.length === 1) setOpenKeys([]);
            naviagte(key);
          }}
          className="custom-menu"
        />
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 text-center border-t border-[#fb6332] bg-white"
        >
          {showDialog ? (
            <div
              className="w-full cursor-pointer animate-pulse"
              onClick={handleOpenDialog}
            >
              <Alert
                message={
                  <div className="flex items-center justify-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      New Updated: V{localVersion}
                      <ArrowRightOutlined />V{serverVersion}
                    </span>
                  </div>
                }
                type="warning"
                banner
                showIcon={false}
                className="rounded-md !bg-orange-50 !text-orange-800 !border-orange-200 px-4 py-1"
              />
            </div>
          ) : (
            <Alert
              message={
                <div className="flex flex-col items-center text-center text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      Version: {localVersion}
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-gray-500 mt-1">
                    Updated on: 25-08-2025
                  </div>
                </div>
              }
              type="info"
              banner
              showIcon={false}
              className="rounded-md !bg-orange-50 !text-orange-800 !border-orange-200 px-4 py-1"
            />
          )}
        </motion.div>
      )}
    </motion.aside>
  );
}
