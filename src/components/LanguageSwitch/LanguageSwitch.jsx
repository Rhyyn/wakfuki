import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";
import cssModule from "./LanguageSwitch.module.scss";
import Image from "next/image";

const LanguageSwitch = React.memo(() => {
  const [flagToggle, setFlagToggle] = useState();
  const { i18n } = useTranslation();


  const changeLanguageAndSave = (newLanguage, v) => {
    setFlagToggle(v);
    localStorage.setItem("language", newLanguage);
    Cookies.remove("language");
    i18n.changeLanguage(newLanguage);
  };

  const retrieveLanguageFromCookie = () => {
    const hasLanguageBeenSet = localStorage.getItem("languageSet");
    let savedLanguage;
    if (!hasLanguageBeenSet) {
      localStorage.setItem("language", "en");
      localStorage.setItem("languageSet", "true");
      savedLanguage = localStorage.getItem("language");
    }

    savedLanguage = localStorage.getItem("language");
    i18n.changeLanguage(savedLanguage);

    if (savedLanguage === "en") {
      setFlagToggle(2);
    } else {
      setFlagToggle(1);
    }
  };

  useEffect(() => {
    retrieveLanguageFromCookie();
  }, []);

  const { t } = useTranslation("common");

  return (
    <div className={cssModule["language-container"]}>
      <Image
        className={`${cssModule["flag-icon"]} ${
          flagToggle === 1 ? cssModule["opacity-100"] : cssModule["opacity-30"]
        }`}
        src="/france-flag.png"
        width={50}
        height={30}
        unoptimized
        onClick={() => changeLanguageAndSave("fr", 1)}
        alt="france-flag"
      />
      <Image
        className={`${cssModule["flag-icon"]} ${
          flagToggle === 2 ? cssModule["opacity-100"] : cssModule["opacity-30"]
        }`}
        src="/united-kingdom-flag.png"
        width={50}
        height={30}
        unoptimized
        onClick={() => changeLanguageAndSave("en", 2)}
        alt="uk-flag"
      />
    </div>
  );
});

LanguageSwitch.displayName = "LanguageSwitch";

export default LanguageSwitch;
