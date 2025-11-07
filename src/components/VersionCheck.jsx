import { ReloadOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usetoken from "../api/usetoken";
import useLogout from "../hooks/useLogout";
import { setShowUpdateDialog } from "../store/auth/versionSlice";

const { Text, Title } = Typography;

const VersionCheck = () => {
  const token = usetoken();
  const dispatch = useDispatch();
  const logout = useLogout();

  const [loading, setLoading] = useState(false);
  const [retryPopup, setRetryPopup] = useState(false);

  const isDialogOpen = useSelector((state) => state.version.showUpdateDialog);
  const serverVersion = useSelector((state) => state.version.version);

  const handleCloseDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: false,
        version: serverVersion,
      })
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      await logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retryPopup) {
      const timeout = setTimeout(() => {
        dispatch(
          setShowUpdateDialog({
            showUpdateDialog: true,
            version: serverVersion,
          })
        );
        setRetryPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [retryPopup]);

  if (!token) return null;

  return (
    <Modal
      open={isDialogOpen}
      closable={false}
      footer={null}
      centered
      maskClosable={false}
      onCancel={handleCloseDialog}
    >
      <div className="text-center py-4">
        <Space
          direction="vertical"
          align="center"
          size="middle"
          className="w-full"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600">
            <ReloadOutlined spin className="text-xl" />
          </div>
          <Title level={4}>Update Available</Title>
          <Text type="secondary">
            A new version of the panel is ready. Update now to version{" "}
            <Text strong type="success">
              {serverVersion}
            </Text>
            .
          </Text>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => {
                handleCloseDialog();
                setRetryPopup(true);
              }}
            >
              Do It Later
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleLogout}
            >
              {loading ? "Updating" : "Update Now"}
            </Button>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default VersionCheck;
