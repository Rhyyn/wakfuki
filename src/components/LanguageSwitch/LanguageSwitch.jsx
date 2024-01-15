import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";
import cssModule from "./LanguageSwitch.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";

// TODO:
// Something in this component is creating re-renders
// for the whole app

const LanguageSwitch = () => {
  const router = useRouter();
  const [flagToggle, setFlagToggle] = useState(1);
  const { i18n } = useTranslation();

  const changeLanguageAndSave = (newLanguage, v) => {
    setFlagToggle(v);
    Cookies.remove("language");
    i18n.changeLanguage(newLanguage);
    Cookies.set("language", newLanguage, { expires: 365 });
  };

  const retrieveLanguageFromCookie = () => {
    const savedLanguage = Cookies.get("language");

    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage).then(() => {
        router.replace(router.pathname, router.asPath, {
          locale: savedLanguage,
        });
      });
      if (savedLanguage == 'en') {
        setFlagToggle(2);
      } else {
        setFlagToggle(1);
      }
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
          flagToggle === 1
            ? cssModule["opacity-100"]
            : cssModule["opacity-30"]
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
          flagToggle === 2
            ? cssModule["opacity-100"]
            : cssModule["opacity-30"]
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
};

export default LanguageSwitch;


