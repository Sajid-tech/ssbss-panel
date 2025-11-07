import { App, Button, Card, Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";
import { PANEL_CHANGE_PASSWORD } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";

const ChangePassword = ({ open, setOpenDialog }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { trigger: SubmitTrigger, loading: submitloading } = useApiMutation();

  const username = useSelector((state) => state.auth?.user?.mobile || "");

  const handleProfileSave = async (values) => {
    try {
      const payload = {
        username,
        old_password: values.old_password,
        new_password: values.new_password,
      };

      const response = await SubmitTrigger({
        url: PANEL_CHANGE_PASSWORD,
        method: "post", 
        data: payload,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
      });

      if (response.code === 201) {
        message.success(response.message || "Password updated successfully!");
        setOpenDialog(false);
        form.resetFields();
      } else {
        message.error(response.message || "Password update failed");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;

      if (typeof errMsg === "string") {
        message.error(errMsg);
      } else if (typeof errMsg === "object") {
        const flatErrors = Object.values(errMsg).flat();
        flatErrors.forEach((msg) => message.error(msg));
      } else {
        message.error("Something went wrong while updating the password.");
      }
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      maskClosable={false}
      onCancel={() => setOpenDialog(false)}
      width={800}
    >
      <h2 className="text-2xl font-bold text-[#fb6332]">Change Password</h2>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileSave}
          requiredMark={false}
          className="mt-4"
          initialValues={{ username }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label={
                <span>
                  Username <span className="text-red-500">*</span>
                </span>
              }
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Old Password <span className="text-red-500">*</span>
                </span>
              }
              name="old_password"
              rules={[{ required: true, message: "Old password is required" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  New Password <span className="text-red-500">*</span>
                </span>
              }
              name="new_password"
              rules={[
                { required: true, message: "New password is required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value !== getFieldValue("old_password")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "New password must be different from old password"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <div className="mt-6">
            <Form.Item className="text-center mt-6">
              <Button type="primary" htmlType="submit" loading={submitloading}>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default ChangePassword;
