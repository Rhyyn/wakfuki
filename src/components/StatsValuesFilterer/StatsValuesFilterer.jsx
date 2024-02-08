import React, {useEffect, useState} from "react";
import cssModule from "./StatsValuesFilterer.module.scss";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useDevice } from "../Contexts/DeviceContext";
import { useGlobalContext } from "../Contexts/GlobalContext";

// TODO : add sorting dropdown

const StatsValuesFilterer = ({ updateStats, handleStatsValuesFiltererInputChange, setIsMobileFilterShowing, isMobileFilterShowing, handleResetFilters }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t } = useTranslation();
  const { deviceType } = useDevice();

  const [selectedStats, setSelectedStats] = useState([]);
  useEffect(() => {
    let newStats = [];
    console.log(globalFilterState.stats);
    globalFilterState.stats.forEach(stat => {
      newStats.push(stat)
    });

    setSelectedStats(newStats);
  }, [globalFilterState.stats]); // this does not trigger for some reason?

  let timer;
  const handleValueInputChange = (value, element) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleStatsValuesFiltererInputChange(value, element);
    }, 500);
  };

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
        {selectedStats &&
          selectedStats.length > 0 &&
          selectedStats.map((element) => (
            <div key={element.property} className={cssModule["value-editor"]}>
              <Image
                alt={element.property}
                width={24}
                height={24}
                src={`/stats/${element.property}.png`}
              />
              <input
                defaultValue={element.value}
                onChange={(e) => handleValueInputChange(e.target.value, element)}
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
