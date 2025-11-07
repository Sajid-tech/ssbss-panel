import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { REGESTRATION_DATA } from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import CardHeader from "../../components/common/CardHeader";
import CropImageModal from "../../components/common/CropImageModal";
import membershipTypes from "../../components/json/membershipTypes.json";
import { useApiMutation } from "../../hooks/useApiMutation";
const NewRegisterationForm = () => {
  const { newId } = useParams();
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
  const [spouseImageInfo, setSpouseImageInfo] = useState({
    file: null,
    preview: "",
  });
  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });

  const isEditMode = Boolean(newId);

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: `${REGESTRATION_DATA}/${newId}`,
      });
      if (!res?.data) return;
      const member = res.data;
      setInitialData(member);

      const userImageBase = res.image_url?.find(
        (img) => img.image_for == "User"
      )?.image_url;

      if (member.user_image && userImageBase) {
        setUserImageInfo({
          file: null,
          preview: `${userImageBase}${member.user_image}`,
        });
      }
      if (member.spouse_image && userImageBase) {
        setSpouseImageInfo({
          file: null,
          preview: `${userImageBase}${member.spouse_image}`,
        });
      }

      form.setFieldsValue({
        ...member,
        user_dob: member.user_dob ? dayjs(member.user_dob) : null,
        user_spouse_dob: member.user_spouse_dob
          ? dayjs(member.user_spouse_dob)
          : null,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchMember();
    } else {
      form.resetFields();
    }
  }, [newId]);
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("user_full_name", values.user_full_name?.trim() || "");
      formData.append(
        "user_dob",
        values.user_dob ? values.user_dob.format("YYYY-MM-DD") : ""
      );
      formData.append("user_mobile", values.user_mobile?.trim() || "");
      formData.append("user_whatsapp", values.user_whatsapp?.trim() || "");
      formData.append("user_email", values.user_email?.trim() || "");
      formData.append("user_add", values.user_add?.trim() || "");
      formData.append(
        "user_spouse_name",
        values.user_spouse_name?.trim() || ""
      );
      formData.append(
        "user_spouse_mobile",
        values.user_spouse_mobile?.trim() || ""
      );
      formData.append(
        "user_spouse_dob",
        values.user_spouse_dob
          ? values.user_spouse_dob.format("YYYY-MM-DD")
          : ""
      );
      formData.append("user_type", values.user_type || "");
      formData.append("user_cat", values.user_cat || "");
      formData.append(
        "user_status",
        values.user_status ? "active" : "inactive"
      );
      if (userImageInfo.file) {
        formData.append("user_image", userImageInfo.file);
      }

      if (spouseImageInfo.file) {
        formData.append("spouse_image", spouseImageInfo.file);
      }
      const res = await submitTrigger({
        url: `${REGESTRATION_DATA}/${newId}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.code == 201) {
        message.success(res.message || "Registration Updated!");
        navigate("/new-registration-list");
      } else {
        message.error(res.message || "Failed to save registration.");
      }
    } catch (error) {
      message.error(error.response.data.message || "Something went wrong.");
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
    } else if (cropState.target == "spouse") {
      setSpouseImageInfo({ file, preview: fileUrl });
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
        title={<CardHeader title="Update New Registration" />}
        extra={
          <Form.Item
            name="user_status"
            valuePropName="checked"
            style={{ marginBottom: "0px" }}
          >
            <Switch />
          </Form.Item>
        }
      >
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label={
              <span>
                Full Name <span className="text-red-500">*</span>
              </span>
            }
            name="user_full_name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input maxLength={20} autoFocus />
          </Form.Item>
          <Form.Item
            label={
              <span>
                DOB <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Select DOB" }]}
            name="user_dob"
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Mobile Number<span className="text-red-500">*</span>
              </span>
            }
            name="user_mobile"
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
          <Form.Item
            label="Whatsapp Mobile"
            name="user_whatsapp"
            rules={[
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
          <Form.Item
            label={
              <span>
                Email <span className="text-red-500">*</span>
              </span>
            }
            name="user_email"
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
          <Form.Item label="Spouse Name" name="user_spouse_name">
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            label="Spouse Mobile"
            name="user_spouse_mobile"
            rules={[
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
          <Form.Item label="Spouse DOB" name="user_spouse_dob">
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            label="User Type"
            name="user_type"
            rules={[{ required: true, message: "Please select user type" }]}
          >
            <Select placeholder="Select membership type" allowClear>
              {membershipTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <span>
                User Category <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Category is required" }]}
            name="user_cat"
          >
            <Input />
          </Form.Item>
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
          <Form.Item name="spouse_image" label={<span>Spouse Image</span>}>
            <div className="flex items-center gap-4">
              <AvatarCell imageSrc={spouseImageInfo.preview} />{" "}
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  openCropper(file, "spouse");
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="w-full">
                  Upload Image
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item label="Address" name="user_add" className="col-span-4">
            <Input.TextArea rows={4} />
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
