import React from "react";
import cssModule from "./SettingsModal.module.scss";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";

const SettingsModal = ({ setIsModalShowing }) => {
  return (
    <React.Fragment>
      <div className={cssModule["settings-modal"]}>
        <div className={cssModule["header-container"]}>
          <button
            className={cssModule["close-button"]}
            onClick={() => setIsModalShowing(false)}
          >
            close
          </button>
        </div>
        <LanguageSwitch />
        <button className={cssModule["delete-button"]}>Delete the DB</button>
      </div>
      <div className={cssModule["shadow-box"]}></div>
    </React.Fragment>
  );
};

export default SettingsModal;
