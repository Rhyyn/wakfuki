import React, { useState, useRef, useEffect } from "react";
import cssModule from "./LevelFilter.module.scss";
import RangeSlider from "./RangeSlider";

const LevelFilter = () => {
    return (
        <div className={cssModule["level-filter-container"]}>
            <RangeSlider />
        </div>
    );
};

export default LevelFilter;
