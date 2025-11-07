import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EVENT } from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import CropImageModal from "../../components/common/CropImageModal";
import { useApiMutation } from "../../hooks/useApiMutation";
const membershipTypes = [
  { label: "All", value: "All" },
  { label: "Life Membership", value: "Life Membership" },
  { label: "Trustee", value: "Trustee" },
  { label: "Couple Membership", value: "Couple Membership" },
  { label: "Members", value: "Members" },
];
const noofMember = [
  { label: "One Card One Member", value: "One Card One Member" },
  { label: "One Card Multi Member", value: "One Card Multi Member" },
];

const EventForm = ({ open, setOpenDialog, eventId, fetchEvents }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const isEditMode = Boolean(eventId);
  const paymentValue = Form.useWatch("event_payment", form);

  const [eventImageInfo, setEventImageInfo] = useState({
    file: null,
    preview: "",
  });

  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });

  const resetForm = () => {
    form.setFieldsValue({
      event_name: undefined,
      event_description: undefined,
      event_payment: undefined,
      event_amount: undefined,
      event_from_date: undefined,
      event_to_date: undefined,
      event_status: false,
      event_member_allowed: undefined,
      event_no_member_allowed: undefined,
    });

    setEventImageInfo({ file: null, preview: "" });
  };

  const fetchEvent = async () => {
    try {
      const res = await fetchTrigger({
        url: `${EVENT}/${eventId}`,
      });
      if (!res?.data) return;
      const event = res.data;
      setInitialData(event);

      const userImageBase = res.image_url?.find(
        (img) => img.image_for === "Event"
      )?.image_url;

      if (event.event_image && userImageBase) {
        setEventImageInfo({
          file: null,
          preview: `${userImageBase}${event.event_image}`,
        });
      }

      form.setFieldsValue({
        event_name: event.event_name,
        event_description: event.event_description,
        event_payment: event.event_payment,
        event_amount: event.event_amount,
        event_member_allowed: event.event_member_allowed,
        event_no_member_allowed: event.event_no_member_allowed,
        date_range: [
          event.event_from_date ? dayjs(event.event_from_date) : null,
          event.event_to_date ? dayjs(event.event_to_date) : null,
        ],
        event_status: event.event_status == "Active",
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.message || "Failed to load event.");
    }
  };

  useEffect(() => {
    if (open && eventId) {
      fetchEvent();
    } else {
      resetForm();
    }
  }, [eventId]);

  const handleSubmit = async (values) => {
    const [from, to] = values?.date_range || [];
    const formData = new FormData();
    formData.append("event_name", values.event_name?.trim() || "");
    formData.append(
      "event_description",
      values.event_description?.trim() || ""
    );
    formData.append("event_member_allowed", values.event_member_allowed || "");
    formData.append(
      "event_no_member_allowed",
      values.event_no_member_allowed || ""
    );
    formData.append("event_from_date", from ? from.format("YYYY-MM-DD") : "");
    formData.append("event_to_date", to ? to.format("YYYY-MM-DD") : "");
    formData.append("event_payment", values.event_payment?.trim() || "");
    formData.append("event_amount", values.event_amount?.trim() || "");
    if (eventImageInfo.file) {
      formData.append("event_image", eventImageInfo.file);
    }
    if (isEditMode) {
      formData.append(
        "event_status",
        values.event_status ? "Active" : "Inactive" || ""
      );
    }

    try {
      const res = await submitTrigger({
        url: isEditMode ? `${EVENT}/${eventId}?_method=PUT` : EVENT,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.code === 201) {
        message.success(res.message || "Event saved!");
        setOpenDialog(false);
        fetchEvents();
      } else {
        message.error(res.message || "Failed to save event.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const openCropper = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
        target: "event_image",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    const file = new File([blob], cropState.tempFileName || "image.jpg", {
      type: blob.type,
    });

    setEventImageInfo({ file, preview: fileUrl });

    setCropState({
      modalVisible: false,
      imageSrc: null,
      tempFileName: "",
      target: "",
    });
  };
  return (
    <Modal
      open={open}
      onCancel={() => setOpenDialog(false)}
      footer={null}
      centered
      maskClosable={false}
      width={900}
    >
      {fetchloading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          initialValues={{
            ...initialData,
            event_no_member_allowed: undefined,
            event_from_date: initialData?.event_from_date
              ? dayjs(initialData?.event_from_date)
              : "",
            event_to_date: initialData?.event_to_date
              ? dayjs(initialData?.event_to_date)
              : "",
          }}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="mt-4"
        >
          <Card
            title={
              <h2 className="text-2xl font-bold heading">
                {isEditMode ? "Update Event" : "Create Event"}
              </h2>
            }
            extra={
              isEditMode && (
                <Form.Item
                  name="event_status"
                  valuePropName="checked"
                  style={{ marginBottom: "0px" }}
                >
                  <Switch />
                </Form.Item>
              )
            }
            bordered={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label={
                  <span>
                    Event Name <span className="text-red-500">*</span>
                  </span>
                }
                name="event_name"
                rules={[{ required: true, message: "Event Name is required" }]}
              >
                <Input maxLength={50} autoFocus/>
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Date <span className="text-red-500">*</span>
                  </span>
                }
                name="date_range"
                rules={[
                  { required: true, message: "Please select a date range" },
                ]}
              >
                <DatePicker.RangePicker
                  format="DD-MM-YYYY"
                  className="w-full"
                  placeholder={["From Date", "To Date"]}
                />
              </Form.Item>
              <Form.Item
                name="event_payment"
                label={
                  <span>
                    Payment <span className="text-red-500">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Please select a Payment" }]}
              >
                <Select placeholder="Select Payment" allowClear showSearch>
                  <Select.Option value="Yes">Yes</Select.Option>
                  <Select.Option value="No">No</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {paymentValue == "Yes" && (
                <Form.Item
                  label={
                    <span>
                      Amount <span className="text-red-500">*</span>
                    </span>
                  }
                  name="event_amount"
                  rules={[
                    {
                      pattern: /^\d+(\.\d{1,2})?$/,
                      message: "Enter a valid amount (up to 2 decimal places)",
                    },
                    { required: true, message: "Amount is required" },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              )}

              <Form.Item
                label={
                  <span>
                    Allowed Member <span className="text-red-500">*</span>
                  </span>
                }
                name="event_member_allowed"
                rules={[{ required: true, message: "Select a Allowed Member" }]}
              >
                <Select placeholder="Select Allowed Member " allowClear>
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
                    No of Member Allowed <span className="text-red-500">*</span>
                  </span>
                }
                name="event_no_member_allowed"
                rules={[
                  {
                    required: true,
                    message: "Selec No of Member Allowed ",
                  },
                ]}
              >
                <Select placeholder="Select Allowed Member " allowClear>
                  {noofMember.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="event_image"
                label={
                  <span>
                    Event Image <span className="text-red-500">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Event Image is required" }]}
              >
                <div className="flex items-center gap-4">
                  <AvatarCell imageSrc={eventImageInfo.preview} />
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      openCropper(file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Image
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </div>
            <Form.Item label="Description" name="event_description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item className="text-center mt-6">
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Card>
        </Form>
      )}

      <CropImageModal
        open={cropState.modalVisible}
        imageSrc={cropState.imageSrc}
        onCancel={() =>
          setCropState((prev) => ({ ...prev, modalVisible: false }))
        }
        onCropComplete={handleCroppedImage}
        maxCropSize={{ width: 400, height: 400 }}
        title="Crop Event Image"
        cropstucture={true}
      />
    </Modal>
  );
};

export default EventForm;
