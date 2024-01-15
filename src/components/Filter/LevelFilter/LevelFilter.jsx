import React, { useState, useEffect } from "react";
import cssModule from "./LevelFilter.module.scss";
import RangeSlider from "./RangeSlider";

// 0-20
// 21-35
// 36-50
// 51-65
// 66-80
// 81-95
// 96-110
// 111-125
// 126-140
// 141-155
// 156-170
// 171-185
// 186-200
// 201-215
// 216-230

const LevelFilter = ({
  handleLevelChange,
  handleResetFilters,
  resetFiltersFlag
}) => {
  const [selectedRange, setSelectedRange] = useState({ from: 0, to: 230 });
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
    setSelectedRange(selectedRangeValue);
  };

  const selectedKey = Object.keys(ranges_dict).find(
    (key) =>
      ranges_dict[key].from === selectedRange.from &&
            ranges_dict[key].to === selectedRange.to
  );

  useEffect(() => {
    setSelectedRange({ from: 0, to: 230 });
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
      <RangeSlider
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />
    </div>
  );
};

export default LevelFilter;
