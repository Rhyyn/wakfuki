import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDevice } from "../Contexts/DeviceContext";
import cssModule from "./Header.module.scss";

const Header = ({ setIsModalShowing, handleMobileNav }) => {
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
            style={{ cursor: "pointer" }}
            src="/UI-icons/Header/menu.svg"
            alt="menu icon"
            width={55}
            height={55}
            onClick={() => handleMobileNav()}
          />
        )}
      </div>
      <div className={cssModule["title-container"]}>
        <h2 className={cssModule["first-part-title"]}>Wakfu</h2>
        <h1 className={cssModule["second-part-title"]}>KI</h1>
      </div>
      <div className={cssModule["menu-icon-container"]}>
        <Image
          style={{ paddingRight: "10px", height: "auto", cursor: "pointer" }}
          src="/UI-icons/Header/cog.svg"
          alt="menu icon"
          width={55}
          height={55}
          onClick={() => setIsModalShowing(true)}
        />
      </div>
    </div>
  );
};

Header.displayName = "Header";

export default Header;
