import { App, Button, Card, DatePicker, Form, Input, Modal, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EVENT_TRACK } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";

const EventTrackForm = ({ open, setOpenDialog, eventId, fetchEvents }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const isEditMode = Boolean(eventId);

  const resetForm = () => {
    form.setFieldsValue({
      event_id: "",
      event_member_mid: "",
      event_entry_date: "",
      event_no_of_people: "",
    });
  };

  const fetchEvent = async () => {
    try {
      const res = await fetchTrigger({
        url: `${EVENT_TRACK}/${eventId}`,
      });
      if (!res?.data) return;
      const event = res.data;
      setInitialData(event);

      form.setFieldsValue({
        event_member_mid: event.event_member_mid,
        event_no_of_people: event.event_no_of_people,
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
  }, [open, eventId]);

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      event_entry_date: values.event_entry_date
        ? dayjs(values.event_entry_date).format("YYYY-MM-DD")
        : "",
    };
    try {
      const res = await submitTrigger({
        url: isEditMode ? `${EVENT_TRACK}/${eventId}` : EVENT_TRACK,
        method: isEditMode ? "put" : "post",
        data: formattedValues,
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
              {isEditMode ? "Update Event" : "Create Event"} Track
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
                        Event Id <span className="text-red-500">*</span>
                      </span>
                    }
                    name="event_id"
                    rules={[
                      { required: true, message: "Event Id is required" },
                    ]}
                  >
                    <Input maxLength={10} autoFocus />
                  </Form.Item>
                  <Form.Item label="Entry Date" name="event_entry_date">
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                </>
              )}
              <Form.Item
                label={
                  <span>
                    Member MID <span className="text-red-500">*</span>
                  </span>
                }
                name="event_member_mid"
                rules={[{ required: true, message: "Member mid is required" }]}
              >
                <Input maxLength={10} autoFocus />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    People <span className="text-red-500">*</span>
                  </span>
                }
                name="event_no_of_people"
                rules={[
                  {
                    pattern: /^[0-9]+$/,
                    message: "Enter a valid numeric amount",
                  },
                  { required: true, message: "People is required" },
                ]}
              >
                <Input maxLength={10} />
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

export default EventTrackForm;
