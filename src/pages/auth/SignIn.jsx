import { App, Button, Form, Input, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PANEL_LOGIN } from "../../api";
import useFinalUserImage from "../../components/common/Logo";
import { useApiMutation } from "../../hooks/useApiMutation";
import { setCredentials } from "../../store/auth/authSlice";
import logo from "../../assets/logo-1.png";
const { Title } = Typography;
import bgSignin from "../../assets/bg-sigin.png";
const SignIn = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trigger, loading } = useApiMutation();
  const token = useSelector((state) => state.auth.token);
  const finalUserImage = useFinalUserImage();
  if (token) {
    return <Navigate to="/home" replace />;
  }
  const onFinish = async (values) => {
    const { email, password } = values;

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await trigger({
        url: PANEL_LOGIN,
        method: "post",
        data: formData,
      });
      if (res.code == 200 && res.UserInfo?.token) {
        const { UserInfo, company_detils, company_image, version } = res;

        dispatch(
          setCredentials({
            token: UserInfo.token,
            tokenExpireAt: UserInfo.token_expires_at,
            user: UserInfo.user,
            userDetails: company_detils,
            userImage: company_image,
            version: version?.version_panel,
          })
        );

        navigate("/home");
      } else {
        message.error(
          res.message || "Login Failed, Please check your credentials."
        );
      }
    } catch (err) {
      message.error(
        err.response.data.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${bgSignin})` }}
      >
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 backdrop-blur-md p-6 m-4 overflow-hidden">
          <div className="flex flex-col justify-center px-6 py-8">
            <div className="text-center mb-6">
              <img
                src={finalUserImage || ""}
                alt="Logo"
                className="h-20 mx-auto"
              />
              <Title level={3} className="text-gray-800">
                Sign in to your account
              </Title>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="w-full"
              initialValues={{
                email: "9876543210",
                password: "123456",
              }}
              requiredMark={false}
            >
              <Form.Item
                label={
                  <span>
                    Username <span className="text-red-500">*</span>
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input size="large" placeholder="Enter username" autoFocus />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
                label={
                  <span>
                    Password <span className="text-red-500">*</span>
                  </span>
                }
              >
                <Input.Password size="large" placeholder="Enter password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {loading ? "Checking..." : "Sign In"}
                </Button>
              </Form.Item>

              <div className="text-right">
                <Link to="/forget-password">Forgot password?</Link>
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

export default SignIn;
