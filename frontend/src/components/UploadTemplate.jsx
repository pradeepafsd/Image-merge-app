import { useState } from "react";
import { API } from "../api";

// UploadTemplate component to upload a new template file
export default function UploadTemplate() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  // Handle template upload
  const submit = async () => {
    if (!file) return alert("Please select a template file");
    if (!name.trim()) return alert("Please enter your name");

    // FILE SIZE VALIDATION (1MB)
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      return alert("File size must be less than 1MB");
    }

    const fd = new FormData();
    fd.append("templateFile", file);
    fd.append("templateUploadedBy", name);

    try {
      await API.post("/templates", fd);
      alert("Template Uploaded Successfully!");

      // reset form
      setFile(null);
      setName("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Upload Template</h5>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Uploaded By"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Choose template file..."
              value={file ? file.name : ""}
              readOnly
            />

            <label className="btn btn-outline-secondary mb-0">
              Browse
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={submit}>
          Upload Template
        </button>
      </div>
    </div>
  );
}