import { useState } from "react";
import axios from "axios";

const UploadModel = ({ setFileId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const allowedExtensions = [".stl", ".obj"];
    const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2);

    if (!allowedExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
      alert("Invalid file type. Only STL and OBJ files are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileId(response.data.file_id);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".stl,.obj" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Model"}
      </button>
    </div>
  );
};

export default UploadModel;
