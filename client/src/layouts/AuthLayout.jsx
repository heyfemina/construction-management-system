function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <p>Construction Control</p>
          <h1>One admin workspace for every site, cost, and crew.</h1>
          <div className="auth-stats">
            <span>Site Costing</span>
            <span>Stock Ledger</span>
            <span>Payment Control</span>
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
