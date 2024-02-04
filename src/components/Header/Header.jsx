import React, { useState, useEffect } from "react";
import cssModule from "./Header.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";
import { useDevice } from "../Contexts/DeviceContext";
import Image from "next/image";

const Header = ({ setIsModalShowing }) => {
  const { deviceType } = useDevice();
  const [isComponentReady, setIsComponentReady] = useState(false);

  useEffect(() => {
    setIsComponentReady(true);
  }, []);

  return (
    <div className={cssModule["header-container"]}>
      <div
        className={cssModule["menu-icon-container"]}
        style={{ paddingLeft: "10px" }}
      >
        {isComponentReady && deviceType === "mobile" && (
          <Image
            src="/UI-icons/Header/filter.svg"
            alt="menu icon"
            width={40}
            height={40}
          />
        )}
      </div>
      <div className={cssModule["title-container"]}>
        <h2 className={cssModule["first-part-title"]}>Wakfu</h2>
        <h1 className={cssModule["second-part-title"]}>KI</h1>
      </div>
      <div className={cssModule["menu-icon-container"]}>
        <Image
          style={{ paddingRight: "10px", height: "auto" }}
          src="/UI-icons/Header/cog.svg"
          alt="menu icon"
          width={55}
          height={55}
          onClick={() => setIsModalShowing(true)}
        />
        {/* <LanguageSwitch /> */}
        {/* {isComponentReady && deviceType === "desktop" && <LanguageSwitch />} */}
        {/* {isComponentReady && deviceType === "mobile" && (
          
        )} */}
      </div>
    </div>
  );
};

Header.displayName = "Header";

export default Header;
