// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import AuthFormShell from "../../components/auth/AuthFormShell";
// import { loginUser } from "../../services/authService";
// import { validateEmail, validateRequired } from "../../utils/formValidation";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     const validationError =
//       validateRequired([
//         { label: "Email", value: email },
//         { label: "Password", value: password },
//       ]) || validateEmail(email);

//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = await loginUser({
//         email: email.trim().toLowerCase(),
//         password,
//       });

//       login(data.user, data.token);
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthFormShell
//       eyebrow="Welcome back"
//       title="Admin Login"
//       subtitle="Sign in to manage sites, stock, labour, vendors, and cash flow."
//       error={error}
//       footer={
//         <>
//           New here? <Link to="/register">Create an admin account</Link>
//         </>
//       }
//     >
//       <form onSubmit={handleLogin} className="login-form" noValidate>
//         <label>
//           Email
//           <input
//             type="email"
//             required
//             placeholder="admin@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>

//         <label>
//           Password
//           <input
//             type="password"
//             required
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </label>

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login as Admin"}
//         </button>
//       </form>
//     </AuthFormShell>
//   );
// }

// export default Login;


import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AuthFormShell from "../../components/auth/AuthFormShell";
import { loginUser } from "../../services/authService";
import { validateEmail, validateRequired } from "../../utils/formValidation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.response?.data?.message || "Login failed");
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

          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                paddingRight: "44px",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={2.2} />
              ) : (
                <Eye size={18} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </AuthFormShell>
  );
}

export default Login;