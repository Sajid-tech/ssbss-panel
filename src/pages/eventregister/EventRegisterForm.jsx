import { App, Button, Card, Form, Input, Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { EVENT_REGISTER, PAYMENT_MODE } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";

const EventRegisterForm = ({ open, setOpenDialog, eventId, fetchEvents }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const { trigger: fetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  const resetForm = () => {
    form.setFieldsValue({
      event_register_name: "",
      event_register_mobile: "",
      event_register_email: "",
      event_register_mid: "",
      event_register_amount: "",
      event_register_payment_type: "",
      event_register_transaction: "",
    });
  };

  const isEditMode = Boolean(eventId);
  const fetchPaymentData = async () => {
    try {
      const payment = await fetchTrigger({
        url: PAYMENT_MODE,
      });
      if (payment?.data) {
        setPaymentData(payment.data);
      }
    } catch (err) {
      console.error("Error fetching payment data:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };
  const fetchEvent = async () => {
    try {
      const res = await fetchTrigger({
        url: `${EVENT_REGISTER}/${eventId}`,
      });
      if (!res?.data) return;
      const event = res.data;
      setInitialData(event);

      form.setFieldsValue({
        event_register_name: event.event_register_name,
        event_register_mobile: event.event_register_mobile,
        event_register_email: event.event_register_email,
        event_register_mid: event.event_register_mid,
        event_register_amount: event.event_register_amount,
        event_register_payment_type: event.event_register_payment_type,
        event_register_transaction: event.event_register_transaction,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (open && eventId) {
      fetchEvent();
    } else {
      resetForm();
      fetchPaymentData();
    }
  }, [open, eventId]);

  const handleSubmit = async (values) => {
    try {
      const res = await submitTrigger({
        url: isEditMode
          ? `${EVENT_REGISTER}/${eventId}?_method=PUT`
          : EVENT_REGISTER,
        method: isEditMode ? "put" : "post",
        data: values,
      });

      if (res.code == 201) {
        message.success(res.message || "Event saved!");
        setOpenDialog(false);
        fetchEvents();
      } else {
        message.error(res.message || "Failed to save event.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(error.response.data.message || "Something went wrong.");
    }
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
        <Card
          title={
            <h2 className="text-2xl font-bold heading">
              {isEditMode ? "Update Event" : "Create Event"} Register
            </h2>
          }
          bordered={false}
          style={{ boxShadow: "none" }}
        >
          <Form
            form={form}
            initialValues={initialData}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="mt-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {!isEditMode && (
                <>
                  <Form.Item
                    label={
                      <span>
                        Register Name <span className="text-red-500">*</span>
                      </span>
                    }
                    name="event_register_name"
                    rules={[
                      { required: true, message: "Register name is required" },
                    ]}
                  >
                    <Input maxLength={50} autoFocus />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Mobile Number<span className="text-red-500">*</span>
                      </span>
                    }
                    name="event_register_mobile"
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
                    label={
                      <span>
                        Email <span className="text-red-500">*</span>
                      </span>
                    }
                    name="event_register_email"
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

                  <Form.Item
                    label={
                      <span>
                        Amount <span className="text-red-500">*</span>
                      </span>
                    }
                    name="event_register_amount"
                    rules={[
                      {
                        pattern: /^[0-9]+$/,
                        message: "Enter a valid numeric amount",
                      },
                      { required: true, message: "Amount is required" },
                    ]}
                  >
                    <Input maxLength={10} />
                  </Form.Item>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Form.Item
                label={
                  <span>
                    Register MID <span className="text-red-500">*</span>
                  </span>
                }
                name="event_register_mid"
                rules={[
                  { required: true, message: "Register mid is required" },
                ]}
              >
                <Input maxLength={10} autoFocus />
              </Form.Item>
              <Form.Item
                name="event_register_payment_type"
                label={
                  <span>
                    Payment Type <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please select a Payment Type" },
                ]}
              >
                <Select placeholder="Select Payment Type" allowClear showSearch>
                  {paymentData.map((payment) => (
                    <Select.Option
                      key={payment.payment_mode}
                      value={payment.payment_mode}
                    >
                      {payment.payment_mode}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Transcation <span className="text-red-500">*</span>
                  </span>
                }
                name="event_register_transaction"
                rules={[{ required: true, message: "Transcation is required" }]}
              >
                <Input maxLength={50} />
              </Form.Item>
            </div>
            <Form.Item className="text-center mt-6">
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default EventRegisterForm;
