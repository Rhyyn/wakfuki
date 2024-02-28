import React from "react";
import cssModule from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={cssModule["sk-chase"]}>
      <div className={cssModule["sk-chase-dot"]}></div>
      <div className={cssModule["sk-chase-dot"]}></div>
      <div className={cssModule["sk-chase-dot"]}></div>
      <div className={cssModule["sk-chase-dot"]}></div>
      <div className={cssModule["sk-chase-dot"]}></div>
      <div className={cssModule["sk-chase-dot"]}></div>
    </div>
  );
};

export default Spinner;
