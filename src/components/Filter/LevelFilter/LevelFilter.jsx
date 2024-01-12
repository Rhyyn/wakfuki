import React, { useState, useRef, useEffect } from "react";
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

const LevelFilter = () => {
    const [selectedRange, setSelectedRange] = useState("0-20");
    const ranges = [
        "20",
        "35",
        "50",
        "65",
        "80",
        "95",
        "110",
        "125",
        "140",
        "155",
        "170",
        "185",
        "200",
        "215",
        "230",
    ];
    const handleRangeChange = (e) => {
        setSelectedRange(e.target.value);
    };

    return (
        <div className={cssModule["level-filter-container"]}>
            <div className={cssModule["dropdown"]}>
                <select
                    className={cssModule["dropdown-select"]}
                    value={selectedRange}
                    onChange={handleRangeChange}
                >
                    {ranges.map((range) => (
                        <option key={range} value={range}>
                            {range}
                        </option>
                    ))}
                </select>
            </div>
            <RangeSlider />
        </div>
    );
};

export default LevelFilter;
