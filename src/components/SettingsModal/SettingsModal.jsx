import React from "react";
import cssModule from "./SettingsModal.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { deleteDB } from "../../services/data-service";

const SettingsModal = ({ setIsModalShowing }) => {
  const { t, i18n } = useTranslation();
  return (
    <React.Fragment>
      <div className={cssModule["settings-modal"]}>
        <div className={cssModule["header-container"]}>
          <LanguageSwitch />
          <div className={cssModule["close-button-container"]}>
            <Image
              width="0"
              height="0"
              style={{ width: "40px", height: "auto" }}
              alt="Close button"
              src={"/UI-icons/Settings/close-yellow.svg"}
              className={cssModule["close-button"]}
              onClick={() => setIsModalShowing(false)}
            />
          </div>
        </div>
        <div className={cssModule["body-container"]}>
          <span className={cssModule["warning-text"]}>{t("warning-text")}</span>
          <button
            className={cssModule["delete-button"]}
            onClick={deleteDB}
          >
            {t("delete-button-text")}
          </button>
          <span className={cssModule["feedback-text"]}>{t("feedback-text")}</span>
          <form className={cssModule["form-container"]}>
            <input
              className={cssModule["title-input"]}
              type="text"
              id="title"
              title="title"
              maxLength="30"
              required
              placeholder={t("feedback-form-title")}
            ></input>
            <textarea
              className={cssModule["description-input"]}
              type="text"
              id="description"
              description="description"
              maxLength="300"
              required
              placeholder={t("feedback-form-description")}
            ></textarea>
            <input
              className={cssModule["submit-button"]}
              type="submit"
              value={t("submit-button-text")}
            ></input>
          </form>
        </div>
        <div className={cssModule["footer-container"]}>
          <div className={cssModule["footer-github-container"]}>
            <Link
              href={"https://github.com/rhyyn"}
              rel="noopener noreferrer"
              target="_blank"
              style={{ maxHeight: "30px" }}
            >
              <Image
                width="0"
                height="0"
                style={{ width: "30px", height: "auto" }}
                alt="Github logo/button"
                src={"/UI-icons/Settings/github-yellow.svg"}
              />
            </Link>
            <Link
              href={"https://github.com/rhyyn"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span
                className={cssModule["footer-github-text"]}
                style={{ fontSize: "16px" }}
              >
                Rhyn
              </span>
            </Link>
          </div>
          <div className={cssModule["footer-github-container"]}>
            <Link
              href={"https://github.com/Rhyyn/wakfuki"}
              rel="noopener noreferrer"
              target="_blank"
              style={{ maxHeight: "40px" }}
            >
              <Image
                width="0"
                height="0"
                style={{ width: "40px", height: "auto" }}
                alt="Github logo/button"
                src={"/UI-icons/Settings/github-yellow.svg"}
              />
            </Link>
            <Link
              href={"https://github.com/Rhyyn/wakfuki"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className={cssModule["footer-github-text"]}>WakfuKI</span>
            </Link>
          </div>
          <div className={cssModule["footer-github-container"]}>
            <Link
              href={"https://github.com/kerro"}
              rel="noopener noreferrer"
              target="_blank"
              style={{ maxHeight: "30px" }}
            >
              <Image
                width="0"
                height="0"
                style={{ width: "30px", height: "auto" }}
                alt="Github logo/button"
                src={"/UI-icons/Settings/github-yellow.svg"}
              />
            </Link>
            <Link
              href={"https://github.com/kerro"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span
                className={cssModule["footer-github-text"]}
                style={{ fontSize: "16px" }}
              >
                Kerro
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className={cssModule["shadow-box"]}></div>
    </React.Fragment>
  );
};

export default SettingsModal;
