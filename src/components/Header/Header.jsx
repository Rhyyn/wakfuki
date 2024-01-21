import React from "react";
import cssModule from "./Header.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";

const Header = React.memo(() => {
  return (
    <div className={cssModule["header-container"]}>
      <div className={cssModule["title-container"]}>
        <h2 className={cssModule["first-part-title"]}>Wakfu</h2>
        <h1 className={cssModule["second-part-title"]}>KI</h1>
      </div>
      <LanguageSwitch />
    </div>
  );
});

Header.displayName = "Header";

export default Header;
