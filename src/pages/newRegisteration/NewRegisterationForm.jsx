import { Button, Card, Form, Input, App, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { REGESTRATION_DATA } from "../../api";
import CardHeader from "../../components/common/CardHeader";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Option } = Select;

const NewRegisterationForm = () => {
  const { newId } = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const [paymentModes, setPaymentModes] = useState([]);
  const { trigger: fetchTrigger } = useApiMutation();
  const navigate = useNavigate();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  const isEditMode = Boolean(newId);

  // Fetch payment modes
  const fetchPaymentModes = async () => {
    try {
      const res = await fetchTrigger({
        url: "https://agsdemo.in/ssbssapi/public/api/panel-fetch-payment-mode",
      });
      if (res?.code === 201 && Array.isArray(res.data)) {
        setPaymentModes(res.data);
      }
    } catch (err) {
      console.error("Error fetching payment modes:", err);
      message.error("Failed to load payment modes.");
    }
  };

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: `${REGESTRATION_DATA}/${newId}`,
      });
      if (!res?.data) return;
      
      const member = res.data;
      setInitialData(member);

      form.setFieldsValue({
        event_register_mid: member.event_register_mid || "",
        event_register_payment_type: member.event_register_payment_type || "",
        event_register_transaction: member.event_register_transaction || "",
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    // Fetch payment modes on component mount
    fetchPaymentModes();
    
    if (isEditMode) {
      fetchMember();
    } else {
      form.resetFields();
    }
  }, [newId]);

  const handleSubmit = async (values) => {
    try {
      const res = await submitTrigger({
        url: `${REGESTRATION_DATA}/${newId}`,
        method: "PUT",
        data: values,
      });
      
      if (res.code == 201) {
        message.success(res.message || "Registration Updated!");
        navigate("/new-registration-list");
      } else {
        message.error(res.message || "Failed to save registration.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong.");
    }
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
      <Card title={<CardHeader title="Update Event Registration" />}>
        {/* Display only fields - not editable */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <strong>Event Name:</strong> {initialData.event_name}
          </div>
          <div>
            <strong>Event Register Date:</strong> {initialData.event_register_date}
          </div>
          <div>
            <strong>Name:</strong> {initialData.event_register_name}
          </div>
          <div>
            <strong>Mobile:</strong> {initialData.event_register_mobile}
          </div>
          <div>
            <strong>Email:</strong> {initialData.event_register_email}
          </div>
          <div>
            <strong>Amount:</strong> {initialData.event_register_amount}
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 gap-4">
          <Form.Item
            label="Member ID"
            name="event_register_mid"
          >
            <Input placeholder="Enter Member ID" />
          </Form.Item>

          <Form.Item
            label="Payment Type"
            name="event_register_payment_type"
          >
            <Select 
              placeholder="Select Payment Type"
              allowClear
            >
              {paymentModes.map((payment) => (
                <Option key={payment.payment_mode} value={payment.payment_mode}>
                  {payment.payment_mode}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Transaction ID"
            name="event_register_transaction"
          >
            <Input placeholder="Enter Transaction ID" />
          </Form.Item>
        </div>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            Update Registration
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default NewRegisterationForm;