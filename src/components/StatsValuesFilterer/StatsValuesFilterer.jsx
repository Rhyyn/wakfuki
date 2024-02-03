import React from "react";
import cssModule from "./StatsValuesFilterer.module.scss";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useDevice } from "../DeviceContext/DeviceContext";

const StatsValuesFilterer = ({ stats, updateStats, handleInput, setIsMobileFilterShowing, isMobileFilterShowing }) => {
  const { t } = useTranslation();
  const { deviceType } = useDevice();

  return (
    <div className={cssModule["items-values-filtering-container"]}>
      <div className={cssModule["filter-icon-container"]}>
        {deviceType !== "desktop" && (
          <Image
            src="/UI-icons/Header/filter.svg"
            alt="menu icon"
            width={30}
            height={30}
            onClick={() => setIsMobileFilterShowing(!isMobileFilterShowing)}
          />
        )}
      </div>
      <div className={cssModule["items-values-editor-container"]}>
        {stats &&
          stats.length > 0 &&
          stats.map((element) => (
            <div key={element.property} className={cssModule["value-editor"]}>
              <Image
                alt={element.property}
                width={24}
                height={24}
                src={`/stats/${element.property}.png`}
              />
              <input
                value={element.value}
                onChange={(e) => handleInput(e.target.value, element)}
                className={cssModule["value-input"]}
              />
              <Image
                className={cssModule["cross-icon"]}
                alt="Delete Icon"
                width={16}
                height={16}
                src="/cross_icon_yellow.png"
                onClick={() => updateStats(element.property)}
              />
            </div>
          ))}
      </div>
      <div className={cssModule["items-sorting-container"]}>
        <Image
          className={cssModule["header-icon"]}
          src="/reset_icon_yellow.png"
          width={32}
          height={32}
          unoptimized
          alt="reset-icon"
          title={t("Mise à zéro des Filtres")}
          onClick={() => handleResetFilters()}
        />
        <div className={cssModule["vertical-separator"]}></div>
        <Image
          className={cssModule["header-icon"]}
          src="/sort_icon_yellow.png"
          width={32}
          height={32}
          unoptimized
          alt="sort-icon"
          title={t("Trier par")}
          // onClick={handleSortingOptionsDropdown}
          // ref={dropdownRef}
        />
      </div>
    </div>
  );
};

export default StatsValuesFilterer;
