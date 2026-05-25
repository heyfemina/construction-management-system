import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthFormShell from "../../components/auth/AuthFormShell";
import { registerUser } from "../../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      eyebrow="Create access"
      title="Register Admin"
      subtitle="Create the admin account used to control the construction workspace."
      error={error}
      footer={
        <>
          Already registered? <Link to="/login">Login as admin</Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="login-form">
        <label>
          Name
          <input
            type="text"
            required
            placeholder="Admin name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            required
            placeholder="admin@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength="6"
            placeholder="Create password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Admin Account"}
        </button>
      </form>
    </AuthFormShell>
  );
}

export default Register;
