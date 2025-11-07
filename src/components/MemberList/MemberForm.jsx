import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_MEMBER_BY_ID, UPDATE_MEMBER } from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import CardHeader from "../../components/common/CardHeader";
import CropImageModal from "../../components/common/CropImageModal";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Option } = Select;

const NewRegisterationForm = () => {
  const { memberId } = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger } = useApiMutation();
  const navigate = useNavigate();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const [userImageInfo, setUserImageInfo] = useState({
    file: null,
    preview: "",
  });
  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });
  const [memberCategories, setMemberCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const isEditMode = Boolean(memberId);

  // Fetch member categories
  const fetchMemberCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetchTrigger({
        url: "https://agsdemo.in/ssbssapi/public/api/panel-fetch-member-category",
      });
      
      if (Array.isArray(res?.data)) {
        setMemberCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching member categories:", error);
      message.error("Failed to load member categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: `${GET_MEMBER_BY_ID}/${memberId}`,
      });
      if (!res?.data) return;
      const member = res.data;
      
      // Map only the required fields
      const mappedData = {
        name: member.name,
        email: member.email,
        address: member.address,
        mobile: member.mobile,
        user_mid: member.user_mid,
        user_member_catg_id: member.user_member_catg_id,
        payment_made: member.payment_made || "",
        id_card_taken: member.id_card_taken || "",
        user_image: member.user_image || "",
        user_status: member.user_status === "Active",
      };
      
      setInitialData(mappedData);

      const userImageBase = res.image_url?.find(
        (img) => img.image_for == "User"
      )?.image_url;

      if (member.user_image && userImageBase) {
        setUserImageInfo({
          file: null,
          preview: `${userImageBase}${member.user_image}`,
        });
      }

      form.setFieldsValue(mappedData);
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    // Fetch member categories on component mount
    fetchMemberCategories();

    if (isEditMode) {
      fetchMember();
    } else {
      form.resetFields();
    }
  }, [memberId]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      // Only include the 10 required fields
      formData.append("name", values.name?.trim() || "");
      formData.append("email", values.email?.trim() || "");
      formData.append("address", values.address?.trim() || "");
      formData.append("mobile", values.mobile?.trim() || "");
      formData.append("user_mid", values.user_mid?.trim() || "");
      formData.append("user_member_catg_id", values.user_member_catg_id || "");
      formData.append("payment_made", values.payment_made?.trim() || "");
      formData.append("id_card_taken", values.id_card_taken?.trim() || "");
      formData.append("user_status", values.user_status ? "Active" : "Inactive");
      
      if (userImageInfo.file) {
        formData.append("user_image", userImageInfo.file);
      }

      const res = await submitTrigger({
        url: `${UPDATE_MEMBER}/${memberId}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.code == 201) {
        message.success(res.message || "Member Updated!");
        navigate("/member");
      } else {
        message.error(res.message || "Failed to save member.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const openCropper = (file, target) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
        target,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    const file = new File([blob], cropState.tempFileName || "image.jpg", {
      type: blob.type,
    });
    
    if (cropState.target == "user") {
      setUserImageInfo({ file, preview: fileUrl });
    }

    setCropState({
      modalVisible: false,
      imageSrc: null,
      tempFileName: "",
      target: "",
    });
  };

  return (
    <Form
      form={form}
      initialValues={initialData}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <Card
        title={<CardHeader title="Update Member" />}
        extra={
          <Form.Item
            name="user_status"
            valuePropName="checked"
            style={{ marginBottom: "0px" }}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        }
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Name */}
          <Form.Item
            label={
              <span>
                Name <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input maxLength={50} autoFocus />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label={
              <span>
                Email <span className="text-red-500">*</span>
              </span>
            }
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>

          {/* Mobile */}
          <Form.Item
            label={
              <span>
                Mobile Number<span className="text-red-500">*</span>
              </span>
            }
            name="mobile"
            rules={[
              { required: true, message: "Please enter mobile number" },
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
          >
            <Input
              maxLength={10}
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>

          {/* Member ID */}
          <Form.Item
            label={
              <span>
                Member ID <span className="text-red-500">*</span>
              </span>
            }
            name="user_mid"
            rules={[{ required: true, message: "Please enter member ID" }]}
          >
            <Input maxLength={20} />
          </Form.Item>

          {/* Member Category */}
          <Form.Item
            label={
              <span>
                Member Category <span className="text-red-500">*</span>
              </span>
            }
            name="user_member_catg_id"
            rules={[{ required: true, message: "Please select member category" }]}
          >
            <Select 
              placeholder="Select member category" 
              allowClear
              loading={loadingCategories}
            >
              {memberCategories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.member_category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Payment Made */}
          <Form.Item
            label="Payment Made"
            name="payment_made"
          >
            <Input maxLength={50} />
          </Form.Item>

          {/* ID Card Taken */}
          <Form.Item
            label="ID Card Taken"
            name="id_card_taken"
          >
            <Input maxLength={50} />
          </Form.Item>

          {/* User Image */}
          <Form.Item name="user_image" label="Image">
            <div className="flex items-center gap-4">
              <AvatarCell imageSrc={userImageInfo.preview} />{" "}
              <div className="flex-1">
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  beforeUpload={(file) => {
                    openCropper(file, "user");
                    return false;
                  }}
                  className="w-full"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-full"
                    style={{ display: "block", width: "100%" }}
                  >
                    Upload Image
                  </Button>
                </Upload>
              </div>
            </div>
          </Form.Item>

          {/* Address - Full width */}
          <Form.Item label="Address" name="address" className="col-span-3">
            <Input.TextArea rows={4} maxLength={200} />
          </Form.Item>
        </div>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            Update
          </Button>
        </Form.Item>

        <CropImageModal
          open={cropState.modalVisible}
          imageSrc={cropState.imageSrc}
          onCancel={() =>
            setCropState((prev) => ({ ...prev, modalVisible: false }))
          }
          onCropComplete={handleCroppedImage}
          maxCropSize={{ width: 400, height: 400 }}
          title="Crop Member Image"
          cropstucture={true}
        />
      </Card>
    </Form>
  );
};

export default NewRegisterationForm;