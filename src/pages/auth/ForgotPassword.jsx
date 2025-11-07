import { App, Button, Form, Input, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { PANEL_SEND_PASSWORD } from "../../api";
import useFinalUserImage from "../../components/common/Logo";
import { useApiMutation } from "../../hooks/useApiMutation";
const { Title } = Typography;
import logo from "../../assets/logo-1.png";
import bgSignin from "../../assets/bg-sigin.png";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const finalUserImage = useFinalUserImage();

  const { trigger, loading } = useApiMutation();
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/home" replace />;
  }
  const onFinish = async (values) => {
    const { username, email } = values;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    try {
      const res = await trigger({
        url: PANEL_SEND_PASSWORD,
        method: "post",
        data: formData,
      });
      if (res.code == 200) {
        message.success(res.message || "Sucess");
      } else {
        message.error(res.message || "An error occurred during send password.");
      }
    } catch {
      message.error("An error occurred during send password");
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center "
        style={{ backgroundImage: `url(${bgSignin})` }}
      >
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 backdrop-blur-md p-6 m-4 overflow-hidden">
          {/* Left Side - Login Form */}
          <div className="flex flex-col justify-center px-6 py-8">
            <div className="text-center mb-6">
              <img
                src={finalUserImage || ""}
                alt="Logo"
                className="h-20 mx-auto"
              />
              <Title level={3} className="text-gray-800">
                Reset Your Password
              </Title>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="w-full"
              initialValues={{
                username: "",
                email: "",
              }}
              requiredMark={false}
            >
              <Form.Item
                label={
                  <span>
                    Username <span className="text-red-500">*</span>
                  </span>
                }
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input size="large" placeholder="Enter username" autoFocus />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Email <span className="text-red-500">*</span>
                  </span>
                }
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input size="large" placeholder="Enter Email" type="email" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {loading ? "Checking..." : "Reset Password"}
                </Button>
              </Form.Item>

              <div className="text-right">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                  Sigin?
                </Link>
              </div>
            </Form>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <img
              src={logo}
              alt="Login Illustration"
              className="w-60 h-60 object-contain rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
