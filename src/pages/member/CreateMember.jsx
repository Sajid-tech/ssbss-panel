import React, { useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../hooks/useApiMutation";

const CreateMember = () => {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      // Include only the required fields for creation
      formData.append("name", values.name?.trim() || "");
      formData.append("email", values.email?.trim() || "");
      formData.append("address", values.address?.trim() || "");
      formData.append("mobile", values.mobile?.trim() || "");

      const res = await submitTrigger({
        url: "https://agsdemo.in/ssbssapi/public/api/member",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.code === 201 || res.success) {
        messageApi.success(res.message || "Member created successfully!");
        handleCancel();
        // You might want to refresh the parent component's data here
      } else {
        messageApi.error(res.message || "Failed to create member.");
      }
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleCreate}
      >
        Create Member
      </Button>

      <Modal
        title="Create New Member"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="grid grid-cols-1 gap-4">
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

            {/* Address */}
            <Form.Item 
              label="Address" 
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input.TextArea rows={3} maxLength={200} />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Create Member
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateMember;