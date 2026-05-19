import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
        name,
        email,
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
    <div>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        Register
      </h1>

      <form onSubmit={handleRegister}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "20px" }}>
          <label>Name</label>

          <input
            type="text"
            required
            placeholder="Enter name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Email</label>

          <input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>

          <input
            type="password"
            required
            minLength="6"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={linkTextStyle}>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#059669",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "15px",
  fontWeight: "600",
};

const linkTextStyle = {
  marginTop: "18px",
  textAlign: "center",
};

export default Register;
