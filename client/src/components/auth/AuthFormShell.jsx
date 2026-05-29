function AuthFormShell({
  eyebrow,
  title,
  subtitle,
  error,
  children,
  footer,
}) {
  return (
    <div className="auth-form-wrap">
      <div className="auth-brand-row">
        <div className="auth-brand-mark">CS</div>
        <div>
          <strong>Coretech Software</strong>
          <span>Secure Admin Console</span>
        </div>
      </div>

      <div className="login-heading">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>

      {error && <p className="form-error">{error}</p>}

      {children}

      <p className="auth-link-text">{footer}</p>
    </div>
  );
}

export default AuthFormShell;
