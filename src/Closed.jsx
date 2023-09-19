import React from "react";

export const Closed = () => {
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1>Registration are closed...</h1>
      <img style={{ width: "60%" }} src="/5.svg" alt="" />
      <h2>
        Robtics Club <span style={{ color: "#00c9ff" }}>AKGEC</span>
      </h2>
    </div>
  );
};
