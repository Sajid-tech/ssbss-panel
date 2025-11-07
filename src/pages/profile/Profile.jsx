import { Form, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROFILE, UPDATE_PROFILE } from "../../api";
import ProfileForm from "../../components/user/ProfileForm";
import { useApiMutation } from "../../hooks/useApiMutation";

const UserPage = () => {
  const { trigger: fetchTrigger, loading: fetchloading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitloading } = useApiMutation();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [noImageUrl, setNoImageUrl] = useState("");
  const [addressForms, setAddressForms] = useState([]);
  const navigate = useNavigate();
  const fetchProfile = async () => {
    const res = await fetchTrigger({
      url: PROFILE,
    });

    const userData = res?.data || {};
    const formattedData = {
      ...userData,
      is_email_required: userData.is_email_required === "true",
      is_whatsapp_required: userData.is_whatsapp_required === "true",
    };

    setInitialData(formattedData);

    const userImage = res.image_url?.find((i) => i.image_for == "User");
    const noImage = res.image_url?.find((i) => i.image_for == "No Image");
    setImageBaseUrl(userImage?.image_url || "");
    setNoImageUrl(noImage?.image_url || "");
    setAddressForms(
      Array.isArray(res.address)
        ? res.address.map((a) => ({
            id: a.id || "",
            address_type: a.address_type || "",
            address: a.address || "",
            is_default: a.is_default === "yes",
          }))
        : []
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleAddressChange = (index, field, value) => {
    const updated = [...addressForms];
    if (field === "is_default" && value === true) {
      updated.forEach((_, i) => {
        updated[i].is_default = i === index;
      });
    } else {
      updated[index][field] = value;
    }
    setAddressForms(updated);
  };

  const addRow = () => {
    setAddressForms((prev) => [
      ...prev,
      { id: "", address_type: "", address: "", is_default: false },
    ]);
  };

  const removeRow = (index) => {
    if (addressForms.length > 1) {
      const updated = [...addressForms];
      updated.splice(index, 1);
      setAddressForms(updated);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("firm_name", values.firm_name || "");
      formData.append("gstin", values.gstin || "");
      formData.append("name", values.name || "");
      formData.append("email", values.email || "");
      formData.append("mobile", values.mobile || "");
      formData.append("whatsapp", values.whatsapp || "");
      formData.append("is_active", values.is_active ? "true" : "false");

      formData.append(
        "is_email_required",
        values.is_email_required ? "true" : "false"
      );
      formData.append(
        "is_whatsapp_required",
        values.is_whatsapp_required ? "true" : "false"
      );
      formData.append("user_type", values.user_type || "");
      if (avatarFile) {
        formData.append("avatar_photo", avatarFile);
      }

      formData.append(
        "address_data",
        JSON.stringify(
          addressForms.map((addr) => ({
            ...addr,
            is_default: addr.is_default ? "yes" : "no",
          }))
        )
      );

      await submitTrigger({
        url: `${UPDATE_PROFILE}?_method=PUT`,
        // url: `${UPDATE_PROFILE}`,
        method: "post",
        // method: "put",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Profile updated successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error("Failed to update profile.");
    }
  };
  return (
    <>
      {fetchloading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <ProfileForm
          loading={submitloading}
          type="updateprofile"
          form={form}
          initialValues={initialData}
          onSubmit={handleSubmit}
          imageBaseUrl={imageBaseUrl}
          noImageUrl={noImageUrl}
          addressForms={addressForms}
          setAddressForms={setAddressForms}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          onAddressChange={handleAddressChange}
          onAddAddress={addRow}
          onRemoveAddress={removeRow}
          submititle="Update"
        />
      )}
    </>
  );
};

export default UserPage;
