function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #d1d5db",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}

export default Loader;