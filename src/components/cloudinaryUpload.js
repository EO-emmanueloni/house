export const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = "dvz2giwql"; // Your Cloudinary cloud name
    const UPLOAD_PRESET = "nestwise_uploads"; // Replace with your actual upload preset
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      return data.secure_url; // This is the URL of the uploaded image
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };
  