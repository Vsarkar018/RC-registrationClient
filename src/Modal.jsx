// Modal.js
import React from "react";
// import animationData from "/Animation - 1694683149563.json";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
const Modal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <Player
          autoplay
          loop
          src="/Animation - 1694683149563.json"
          style={{ height: "50%", width: "50%" }}
        ></Player>
      </div>
    </div>
  );
};

export default Modal;
