import { useAuth } from "./services/AuthContext.tsx";
import { useNavigate } from "react-router";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-page">
        <h1>Profile</h1>
        <div className="profile-card">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
        <div className="profile-actions">
          <button className="auth-submit-button" onClick={() => navigate("/")}>
            Back to goals
          </button>
          <button className="auth-toggle-button" onClick={() => signOut()}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
