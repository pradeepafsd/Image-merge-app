import { useState } from "react";
import { API } from "../api";

// UploadUser component to upload a new user photo with name and destination
export default function UploadUser() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");

  // Handle user upload
  const submit = async () => {
    if (!file) return alert("Please select a user photo");
    if (!name.trim()) return alert("Please enter user name");
    if (!destination.trim()) return alert("Please enter destination");

    // FILE SIZE VALIDATION (1MB)
    const MAX_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return alert("File size must be less than 1MB");
    }

    const fd = new FormData();
    fd.append("userPhoto", file);
    fd.append("userName", name);
    fd.append("destination", destination);

    try {
      await API.post("/users", fd);
      alert("User Uploaded Successfully!");

      // reset form
      setFile(null);
      setName("");
      setDestination("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Upload User</h5>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Choose user photo..."
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

        <button className="btn btn-success w-100" onClick={submit}>
          Upload User
        </button>
      </div>
    </div>
  );
}