import Cropper from "react-easy-crop";
import { Modal, Slider } from "antd";
import { useState, useCallback, useEffect } from "react";
import getCroppedImg from "./cropImageUtils";

const CropImageModal = ({
  open,
  imageSrc,
  onCancel,
  onCropComplete,
  title = "Crop Image",
  maxCropSize = { width: 300, height: 300 },
  cropstucture = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const onCropAreaComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Calculate crop area: never larger than actual image
  const cropSize = {
    width: Math.min(maxCropSize.width, imageSize.width),
    height: Math.min(maxCropSize.height, imageSize.height),
  };

  const aspectRatio =
    cropSize.width && cropSize.height
      ? cropSize.width / cropSize.height
      : 4 / 5;

  const handleOk = async () => {
    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      cropSize,
      cropstucture
    );
    onCropComplete(croppedImage);
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      width={1000}
      centered
      maskClosable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          width: "100%",
          height: "64vh",
          position: "relative",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // 🟢 center vertically
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          cropSize={cropSize}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropAreaComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "100%",
              position: "relative",
            },
            mediaStyle: {
              objectFit: "contain",
            },
          }}
        />
      </div>
      <div className="mt-4 px-6 pb-4">
        <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
      </div>
    </Modal>
  );
};

export default CropImageModal;
