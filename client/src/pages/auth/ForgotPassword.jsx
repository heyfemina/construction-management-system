import { useState } from "react";
import { validateEmail, validateRequired } from "../../utils/formValidation";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validationError =
      validateRequired([{ label: "Email address", value: email }]) ||
      validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    console.log({
      email,
    });

    setEmail("");
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
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}
        <div style={{ marginBottom: "20px" }}>
          <label>Email Address</label>

          <input
            type="email"
            required
            placeholder="Enter registered email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Send Reset Link
        </button>
      </form>
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
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const errorStyle = {
  color: "#dc2626",
  fontWeight: "600",
  marginBottom: "12px",
};

export default ForgotPassword;
