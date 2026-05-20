function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <p>Construction Management</p>
          <h1>Track sites, stock, labour, vendors, and cash flow.</h1>
          <div className="auth-stats">
            <span>Materials</span>
            <span>Vendors</span>
            <span>Finance</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">{children}</div>
      </section>
    </div>
  );
}

export default AuthLayout;
