function NoImages(props) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: "#308fb4",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontFamily: "sans-serif", fontSize: props.fontSize, color: "white" }}>{props.username.substr(0, 2)}</p>
    </div>
  );
}

export { NoImages };
