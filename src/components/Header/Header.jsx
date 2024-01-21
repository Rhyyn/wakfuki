import React from "react";
import cssModule from "./Header.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";

const Header = React.memo(() => {
  return (
    <div className={cssModule["header-container"]}>
      <h1 className={cssModule["h1"]}>KI</h1>
      <LanguageSwitch />
    </div>
  );
});

Header.displayName = "Header";

export default Header;
