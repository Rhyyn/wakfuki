import React, { useEffect } from "react";
import cssModule from "./Modal.module.scss";

const Modal = (displayedTextRef) => {
  console.log(displayedTextRef.displayedTextRef.current);
  // useEffect(() => {

  // }, [displayedTextRef.displayedTextRef.current]);

  return (
    <div className={cssModule["modal-container"]}>
      <span className={cssModule["modal-text"]}>
        {/* {displayedTextRef.displayedTextRef.current} */}
      </span>
    </div>
  );
};

export default Modal;
