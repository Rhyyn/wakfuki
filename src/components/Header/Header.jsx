import React from "react";
import cssModule from "./Header.module.scss";

const Header = () => {
    return <div className={cssModule["header-container"]}><h1 className={cssModule["h1"]}>KI</h1></div>;
};


export { Header };