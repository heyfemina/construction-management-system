import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>Email Address</label>

          <input
            type="email"
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

export default ForgotPassword;