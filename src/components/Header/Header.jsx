import React from "react";
import cssModule from "./Header.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
    return (
        <div className={cssModule["header-container"]}>
            <h1 className={cssModule["h1"]}>KI</h1>
            <LanguageSwitch />
        </div>
    );
};

export { Header };
