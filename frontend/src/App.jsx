import './App.css';
import UploadTemplate from "./components/UploadTemplate";
import UploadUser from "./components/UploadUser";
import MergeEditor from "./components/MergeEditor";
import '../node_modules/bootstrap/dist/js/bootstrap';

// Main App component rendering UploadTemplate, UploadUser, and MergeEditor
export default function App() {
  return (
    <div
      className="container-fluid py-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #111827 40%, #020617 100%)"
      }}
    >
      <h2 className="text-center mb-4 text-light">Image Merge App</h2>

      <div className="container">
        {/* keep content centered */}
        <div className="row g-4">
          <div className="col-lg-6">
            <UploadTemplate />
          </div>

          <div className="col-lg-6">
            <UploadUser />
          </div>
        </div>

        <div className="mt-5">
          <MergeEditor />
        </div>
      </div>
    </div>
  );
}