import React, { useEffect, useRef, useState } from "react";
import { useDevice } from "../../Contexts/DeviceContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import cssModule from "./LevelFilter.module.scss";
import RangeSlider from "./RangeSlider";

// TODO : Maybe add an opacity to the selected range if not used

const LevelFilter = ({ resetFiltersFlag }) => {
  const { deviceType } = useDevice();
  const { globalFilterState, dispatch } = useGlobalContext();
  const isInitialRender = useRef(true);
  const selectDropdownRef = useRef(null);
  const customDropdownRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState({
    from: globalFilterState.levelRange.from,
    to: globalFilterState.levelRange.to,
  });
  const selectBtnRef = useRef(null);
  const isDropdownOpen = useRef(false);
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
    if (isDropdownOpen.current) {
      handleShowStatsDropdown();
    }
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

    // console.log("useEffectresetFiltersFlag inside LevelFilter triggered", resetFiltersFlag);

    if (resetFiltersFlag) {
      setSelectedRange({ from: 0, to: 230 });
    }
  }, [resetFiltersFlag]);

  const handleShowStatsDropdown = () => {
    isDropdownOpen.current = !isDropdownOpen.current;
    selectDropdownRef.current.classList.toggle(cssModule["active"]);
    selectBtnRef.current.classList.toggle(cssModule["select-button-active"]);
    selectBtnRef.current.setAttribute(
      "aria-expanded",
      selectBtnRef.current.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
  };

  return (
    <div className={cssModule["level-filter-container"]}>
      <div
        className={cssModule["custom-dropdown"]}
        ref={customDropdownRef}
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* <span className={cssModule["modulation-text"]}>Modulation : </span> */}
        <button
          className={cssModule["select-button"]}
          role="combobox"
          aria-labelledby="select button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="select-dropdown"
          onClick={() => handleShowStatsDropdown()}
          ref={selectBtnRef}
        >
          Modulation - {selectedKey}
        </button>
        <ul
          role="listbox"
          id={cssModule["select-dropdown"]}
          style={{
            bottom: "185px",
            maxHeight: "130px",
            ...(deviceType === "mobile" ? { width: "230px" } : { width: "210px" }),
          }}
          ref={selectDropdownRef}
        >
          {Object.keys(ranges_dict).map((key) => (
            <li
              key={`level-${key}`}
              id={`level-${key}`}
              role="option"
              onClick={() => handleRangeChange({ target: { value: key } })}
              value={key}
              aria-selected={key === selectedKey}
            >
              <label
                // htmlFor={`level-${key}`}
                style={deviceType !== "mobile" ? { maxWidth: "140px" } : { maxWidth: "180px" }}
              >
                {key}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <RangeSlider resetFiltersFlag={resetFiltersFlag} />
    </div>
  );
};

export default LevelFilter;

{
  /* <select
  className={cssModule["dropdown-select"]}
  value={selectedKey}
  onChange={handleRangeChange}
>
  {Object.keys(ranges_dict).map((key) => (
    <option
      key={key}
      value={key}
    >
      {key}
    </option>
  ))}
</select> */
}
