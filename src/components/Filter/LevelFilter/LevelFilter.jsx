import React, { useState, useEffect, useRef } from "react";
import cssModule from "./LevelFilter.module.scss";
import RangeSlider from "./RangeSlider";
import { useGlobalContext } from "../../Contexts/GlobalContext";

// TODO : Maybe add an opacity to the selected range if not used

const LevelFilter = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const isInitialRender = useRef(true);
  const [selectedRange, setSelectedRange] = useState({
    from: globalFilterState.levelRange.from,
    to: globalFilterState.levelRange.to,
  });
  const ranges_dict = {
    20: { from: 0, to: 20 },
    35: { from: 21, to: 35 },
    50: { from: 36, to: 50 },
    65: { from: 51, to: 65 },
    80: { from: 66, to: 80 },
    95: { from: 81, to: 95 },
    110: { from: 96, to: 110 },
    125: { from: 111, to: 125 },
    140: { from: 126, to: 140 },
    155: { from: 141, to: 155 },
    170: { from: 156, to: 170 },
    185: { from: 171, to: 185 },
    200: { from: 186, to: 200 },
    215: { from: 201, to: 215 },
    230: { from: 216, to: 230 },
  };

  const handleRangeChange = (e) => {
    const selectedKey = e.target.value;
    const selectedRangeValue = ranges_dict[selectedKey];
    dispatch({
      type: "UPDATE_LEVEL_RANGE",
      payload: selectedRangeValue,
    });
  };

  // finds ranges in dict that match selectedRange
  const selectedKey = Object.keys(ranges_dict).find(
    (key) =>
      ranges_dict[key].from === selectedRange.from && ranges_dict[key].to === selectedRange.to
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    console.log("useEffectresetFiltersFlag inside LevelFilter triggered", resetFiltersFlag);

    if (resetFiltersFlag) {
      setSelectedRange({ from: 0, to: 230 });
    }
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["level-filter-container"]}>
      <div className={cssModule["dropdown"]}>
        <select
          className={cssModule["dropdown-select"]}
          value={selectedKey}
          onChange={handleRangeChange}
        >
          {Object.keys(ranges_dict).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <RangeSlider resetFiltersFlag={resetFiltersFlag} />
    </div>
  );
};

export default LevelFilter;
