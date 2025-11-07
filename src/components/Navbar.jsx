import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import ChangePassword from "../pages/profile/ChangePassword";
import { useState } from "react";
export default function Navbar({ collapsed, onToggle }) {
  const [open, setOpenDialog] = useState(false);
  const imageUrls = useSelector((state) => state?.auth?.userImage);
  const userImagePath = useSelector((state) => state?.auth?.user?.avatar_photo);
  const userBaseUrl = imageUrls.find(
    (img) => img.image_for == "User"
  )?.image_url;
  const noImageUrl = imageUrls.find(
    (img) => img.image_for == "No Image"
  )?.image_url;
  const finalUserImage = userImagePath
    ? `${userBaseUrl}${userImagePath}`
    : noImageUrl;
  const logout = useLogout();
  const naviagte = useNavigate();
  const handleMenuClick = async ({ key }) => {
    if (key === "logout") {
      try {
        await logout();
      } catch (error) {
      }
    } else if (key === "profile") {
      naviagte("/user-form");
    } else if (key === "chnagepassword") {
      setOpenDialog(true);
    }
  };

  const profileMenu = {
    items: [
      // {
      //   key: "profile",
      //   label: (
      //     <div className="flex items-center gap-2 px-2 py-2">
      //       <UserOutlined className="text-teal-600" />
      //       <span className="text-gray-800">Profile</span>
      //     </div>
      //   ),
      // },
      {
        key: "chnagepassword",
        label: (
          <div className="flex items-center gap-2 px-2 py-2">
            <SettingOutlined className="text-teal-600" />
            <span className="text-gray-800">Change Password</span>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: (
          <div className="flex items-center gap-2 px-2 py-2 text-red-600">
            <LogoutOutlined />
            <span>Logout</span>
          </div>
        ),
      },
    ],
    onClick: handleMenuClick,
    className: "min-w-48",
  };

  return (
    <>
      <header className="bg-white h-14 shadow px-4 flex items-center justify-between">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="text-lg"
        />

        <Dropdown menu={profileMenu} placement="bottomRight" arrow>
          <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-full hover:bg-gray-100 transition-all">
            <Avatar size="large" src={finalUserImage} />
          </div>
        </Dropdown>
      </header>
      <ChangePassword open={open} setOpenDialog={setOpenDialog} />
    </>
  );
}
