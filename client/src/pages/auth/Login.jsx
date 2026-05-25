import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthFormShell from "../../components/auth/AuthFormShell";
import { loginUser } from "../../services/authService";
import { validateEmail, validateRequired } from "../../utils/formValidation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError =
      validateRequired([
        { label: "Email", value: email },
        { label: "Password", value: password },
      ]) || validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      eyebrow="Welcome back"
      title="Admin Login"
      subtitle="Sign in to manage sites, stock, labour, vendors, and cash flow."
      error={error}
      footer={
        <>
          New here? <Link to="/register">Create an admin account</Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="login-form" noValidate>
        <label>
          Email
          <input
            type="email"
            required
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </AuthFormShell>
  );
}

export default Login;
