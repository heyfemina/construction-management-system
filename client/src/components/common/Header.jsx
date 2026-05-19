function Header({ title }) {
  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

export default Header;