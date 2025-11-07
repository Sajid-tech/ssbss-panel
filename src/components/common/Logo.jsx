import { useSelector } from "react-redux";

const useFinalUserImage = () => {
  const imageUrls = useSelector((state) => state?.company?.companyImage);
  const userImagePath = useSelector(
    (state) => state?.company?.companyDetails?.store_logo_image
  );
  const userBaseUrl = imageUrls?.find(
    (img) => img.image_for === "Company"
  )?.image_url;
  const noImageUrl = imageUrls?.find(
    (img) => img.image_for === "No Image"
  )?.image_url;
  const cacheBuster = `?v=${Date.now()}`;
  const finalUserImage = userImagePath
    ? `${userBaseUrl}${userImagePath}${cacheBuster}`
    : noImageUrl;

  return finalUserImage;
};

export default useFinalUserImage;
