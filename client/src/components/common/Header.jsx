function Header({ title, subtitle }) {
  return (
    <div className="page-header">
      <div>
        <p className="page-header-label">Control Panel</p>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default Header;
