import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <p className="empty-title">404 — Page not found</p>
        <p className="subtle">That route doesn't exist in this demo.</p>
        <Link to="/" className="button primary" style={{ marginTop: "1rem" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
