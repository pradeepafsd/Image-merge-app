import { useEffect, useRef, useState } from "react";
import { API } from "../api";

// MergeEditor component to merge user photo with template and allow drag & resize
export default function MergeEditor() {
  const canvasRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [template, setTemplate] = useState("");
  const [user, setUser] = useState("");

  const [userPos, setUserPos] = useState({ x: 100, y: 100, w: 150, h: 150 });
  const [dragging, setDragging] = useState(false);
  const [resizingCorner, setResizingCorner] = useState("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [previewDone, setPreviewDone] = useState(false);

  const HANDLE_SIZE = 10;

  // Fetch templates and users from API
  const fetchData = async () => {
    try {
      const tRes = await API.get("/templates");
      const uRes = await API.get("/users");

      setTemplates(tRes.data || []);
      setUsers(uRes.data || []);

      setPreviewDone(false);
      setTemplate("");
      setUser("");

      const canvas = canvasRef.current;
      if (canvas)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    } catch {
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Draw template and user photo on canvas
  const draw = () => {
    if (!previewDone || !template || !user) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const tImg = new Image();
    const uImg = new Image();

    tImg.crossOrigin = "anonymous";
    uImg.crossOrigin = "anonymous";

    const BASE_URL = import.meta.env.VITE_API_URL;

    tImg.src = `${BASE_URL}/${template}`;
    uImg.src = `${BASE_URL}/${user}`;

    tImg.onload = () => {
      uImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(uImg, userPos.x, userPos.y, userPos.w, userPos.h);
      };
    };
  };

  // Redraw canvas when state changes
  useEffect(() => {
    draw();
  }, [previewDone, template, user, userPos]);

  // Handle Preview button click
  const handlePreviewClick = () => setPreviewDone(true);

  // Download the merged image as PNG
  const download = () => {
    if (!previewDone) return;
    const link = document.createElement("a");
    link.download = "merged.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // Convert mouse event coordinates to canvas coordinates
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      mx: (e.clientX - rect.left) * scaleX,
      my: (e.clientY - rect.top) * scaleY,
    };
  };

  // Get corner handle being hovered for resizing
  const getCorner = (mx, my) => {
    const { x, y, w, h } = userPos;
    const corners = {
      tl: { cx: x, cy: y },
      tr: { cx: x + w, cy: y },
      bl: { cx: x, cy: y + h },
      br: { cx: x + w, cy: y + h },
    };

    for (let key in corners) {
      const c = corners[key];
      if (
        mx >= c.cx - HANDLE_SIZE &&
        mx <= c.cx + HANDLE_SIZE &&
        my >= c.cy - HANDLE_SIZE &&
        my <= c.cy + HANDLE_SIZE
      ) {
        return key;
      }
    }
    return "";
  };

  // Handle mouse down event for dragging/resizing
  const onMouseDown = (e) => {
    const { mx, my } = getMousePos(e);

    const corner = getCorner(mx, my);
    if (corner) {
      setResizingCorner(corner);
      return;
    }

    if (
      mx >= userPos.x &&
      mx <= userPos.x + userPos.w &&
      my >= userPos.y &&
      my <= userPos.y + userPos.h
    ) {
      setDragging(true);
      setOffset({ x: mx - userPos.x, y: my - userPos.y });
    }
  };

  // Handle mouse move event for dragging/resizing and cursor style
  const onMouseMove = (e) => {
    const { mx, my } = getMousePos(e);

    const canvas = canvasRef.current;
    const corner = getCorner(mx, my);

    if (corner)
      canvas.style.cursor =
        corner === "tl" || corner === "br" ? "nwse-resize" : "nesw-resize";
    else if (
      mx >= userPos.x &&
      mx <= userPos.x + userPos.w &&
      my >= userPos.y &&
      my <= userPos.y + userPos.h
    )
      canvas.style.cursor = "move";
    else canvas.style.cursor = "default";

    if (dragging) {
      setUserPos((prev) => ({
        ...prev,
        x: mx - offset.x,
        y: my - offset.y,
      }));
    }

    if (resizingCorner) {
      setUserPos((prev) => {
        let { x, y, w, h } = prev;

        switch (resizingCorner) {
          case "tl":
            w += x - mx;
            h += y - my;
            x = mx;
            y = my;
            break;
          case "tr":
            w = mx - x;
            h += y - my;
            y = my;
            break;
          case "bl":
            w += x - mx;
            h = my - y;
            x = mx;
            break;
          case "br":
            w = mx - x;
            h = my - y;
            break;
        }

        return { x, y, w: Math.max(20, w), h: Math.max(20, h) };
      });
    }
  };

  // Handle mouse up / leave event
  const onMouseUp = () => {
    setDragging(false);
    setResizingCorner("");
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title mb-3">Merge & Preview (Drag & Resize)</h5>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <select
              className="form-select"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t._id} value={t.templateFile}>
                  {t.templateUploadedBy || t.templateFile}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u.userPhoto}>
                  {u.userName || u.userPhoto}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={handlePreviewClick}
            disabled={!template || !user}
          >
            Preview
          </button>

          {previewDone && (
            <button className="btn btn-dark me-2" onClick={download}>
              Generate & Download
            </button>
          )}

          <button className="btn btn-warning" onClick={fetchData}>
            Refresh Data
          </button>
        </div>

        <div className="d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: 500, aspectRatio: "1 / 1" }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border rounded w-100 h-100"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}