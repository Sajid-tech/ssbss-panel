// export default function getCroppedImg(imageSrc, pixelCrop, cropSize) {
//   const canvas = document.createElement("canvas");
//   canvas.width = cropSize.width;
//   canvas.height = cropSize.height;
//   const ctx = canvas.getContext("2d");

//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.crossOrigin = "anonymous";
//     image.src = imageSrc;
//     image.onload = () => {
//       ctx.drawImage(
//         image,
//         pixelCrop.x,
//         pixelCrop.y,
//         pixelCrop.width,
//         pixelCrop.height,
//         0,
//         0,
//         cropSize.width,
//         cropSize.height
//       );
//       canvas.toBlob((blob) => {
//         if (!blob) return reject(new Error("Canvas is empty"));
//         blob.name = "cropped.jpeg";
//         const fileUrl = window.URL.createObjectURL(blob);
//         resolve({ blob, fileUrl });
//       }, "image/jpeg");
//     };
//     image.onerror = reject;
//   });
// }
// getCroppedImg.js
// export default function getCroppedImg(imageSrc, cropPixels) {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.crossOrigin = "anonymous"; // fix for CORS issues if image is remote
//     image.src = imageSrc;

//     image.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = cropPixels.width;
//       canvas.height = cropPixels.height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(
//         image,
//         cropPixels.x,
//         cropPixels.y,
//         cropPixels.width,
//         cropPixels.height,
//         0,
//         0,
//         cropPixels.width,
//         cropPixels.height
//       );

//       canvas.toBlob(
//         (blob) => {
//           if (!blob) {
//             reject(new Error("Canvas is empty"));
//             return;
//           }
//           resolve(blob);
//         },
//         "image/jpeg",
//         1 // quality (0 to 1), for JPEG/WEBP
//       );
//     };

//     image.onerror = (error) => reject(error);
//   });
// }
export default function getCroppedImg(
  imageSrc,
  cropPixels,
  returnObject = false
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        if (returnObject) {
          const fileUrl = URL.createObjectURL(blob);
          resolve({ blob, fileUrl });
        } else {
          resolve(blob);
        }
      }, "image/jpeg");
    };

    image.onerror = (error) => reject(error);
  });
}
