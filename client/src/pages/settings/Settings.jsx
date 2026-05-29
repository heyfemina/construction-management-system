import { useContext, useState } from "react";
import { KeyRound, Mail, Save, UserRound } from "lucide-react";
import { updateProfile } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";

function Settings() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "Admin");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setError("Name and email are required");
      setMessage("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid email address");
      setMessage("");
      return;
    }

    if (password.trim() && password.trim().length < 6) {
      setError("Password must be at least 6 characters");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");
      const { data } = await updateProfile({
        name: cleanName,
        email: cleanEmail,
        password: password.trim(),
      });
      updateUser(data.user);
      setPassword("");
      setMessage("Profile updated successfully");
    } catch (profileError) {
      setError(
        profileError.response?.data?.message || "Could not update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="settings-page">
      <div className="page-header">
        <p className="page-header-label">Account</p>
        <h1>Settings</h1>
        <p>Manage your admin profile details.</p>
      </div>

      <div className="settings-shell">
        <aside className="settings-summary">
          <div className="settings-avatar">
            {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{user?.name || "Admin"}</h2>
            <p>{user?.email || "No email saved"}</p>
          </div>
        </aside>

        <form className="settings-card" onSubmit={handleSubmit}>
          <div className="settings-card-header">
            <div>
              <p>Profile</p>
              <h2>Admin Details</h2>
            </div>
          </div>

          <label className="settings-field">
            <span>Admin name</span>
            <div className="settings-input-wrap">
              <UserRound size={18} strokeWidth={2.2} />
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
              />
            </div>
          </label>

          <label className="settings-field">
            <span>Email address</span>
            <div className="settings-input-wrap">
              <Mail size={18} strokeWidth={2.2} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={120}
              />
            </div>
          </label>

          <label className="settings-field">
            <span>New password</span>
            <div className="settings-input-wrap">
              <KeyRound size={18} strokeWidth={2.2} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                maxLength={120}
                placeholder="Leave blank to keep current password"
              />
            </div>
          </label>

          {error && <p className="settings-error">{error}</p>}
          {message && <p className="settings-success">{message}</p>}

          <div className="settings-actions">
            <button type="submit" disabled={saving}>
              <Save size={17} strokeWidth={2.3} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Settings;
