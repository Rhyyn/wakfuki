import React, { useState, useEffect, useRef } from "react";
import cssModule from "./RangeSlider.module.scss";

const RangeSlider = () => {
    const [fromInputValue, setFromInputValue] = useState(0);
    const [toInputValue, setToInputValue] = useState(230);

    const controlFromInput = (
        fromSlider,
        fromInput,
        toInput,
        controlSlider
    ) => {
        const [from, to] = getParsed(fromInput, toInput);
        fillSlider(fromInput, toInput, "#C6C6C6", "#292621", controlSlider);
        if (from > to) {
            fromSlider.defaultValue = to;
            fromInput.defaultValue = to;
        } else {
            fromSlider.value = from;
        }
    };

    const controlToInput = (toSlider, fromInput, toInput, controlSlider) => {
        const [from, to] = getParsed(fromInput, toInput);
        fillSlider(fromInput, toInput, "#C6C6C6", "#292621", controlSlider);
        setToggleAccessible(toInput);
        console.log(toInput);

        if (from <= to) {
            toSlider.defaultValue = to;
            toInput.defaultValue = to;
        } else {
            toInput.defaultValue = from;
        }
    };

    const controlFromSlider = (fromSlider, toSlider, fromInput) => {
        console.log("controlFromSlider called"); // Add this line
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, "#C6C6C6", "#292621", toSlider);

        setFromInputValue(from); // Set the state value

        if (from > to) {
            fromSlider.defaultValue = to;
            console.log("fromSlider.value", fromSlider.value);
            fromInput.defaultValue = to;
        } else {
            console.log("fromSlider.value", fromSlider.value);
            fromInput.defaultValue = from;
        }
    };

    const controlToSlider = (fromSlider, toSlider, toInput) => {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, "#C6C6C6", "#292621", toSlider);
        setToggleAccessible(toSlider);
        setToInputValue(to); // Set the state value

        if (from <= to) {
            toSlider.defaultValue = to;
            console.log("toSlider.value", toSlider.value);
            toInput.defaultValue = to;
        } else {
            toInput.defaultValue = from;
            toSlider.defaultValue = from;
        }
    };

    const getParsed = (currentFrom, currentTo) => {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    };

    const fillSlider = (from, to, sliderColor, rangeColor, controlSlider) => {
        const rangeDistance = to.max - to.min;
        const fromPosition = from.value - to.min;
        const toPosition = to.value - to.min;

        // console.log('From Position:', fromPosition);
        // console.log('rangeDistance',rangeDistance);
        // console.log('To Position:', toPosition);

        controlSlider.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
            ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
            ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
            ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
            ${sliderColor} 100%)`;
    };

    const setToggleAccessible = (currentTarget) => {
        const toSlider = document.querySelector("#toSlider");
        if (Number(currentTarget.value) <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    };

    useEffect(() => {
        const fromSlider = document.querySelector("#fromSlider");
        const toSlider = document.querySelector("#toSlider");
        const fromInput = document.querySelector("#fromInput");
        const toInput = document.querySelector("#toInput");
        fillSlider(fromSlider, toSlider, "#C6C6C6", "#292621", toSlider);
        setToggleAccessible(toSlider);

        fromSlider.oninput = () =>
            controlFromSlider(fromSlider, toSlider, fromInput);
        toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
        fromInput.oninput = () =>
            controlFromInput(fromSlider, fromInput, toInput, toSlider);
        toInput.oninput = () =>
            controlToInput(toSlider, fromInput, toInput, toSlider);
    }, []);

    return (
        <div className={cssModule["range_container"]}>
            <div className={cssModule["sliders_control"]}>
                <input
                    className={cssModule["range-input"]}
                    id="fromSlider"
                    style={{
                        height: 0,
                        zIndex: 1,
                    }}
                    type="range"
                    value={fromInputValue} // Use value instead of defaultValue
                    min="0"
                    max="230"
                    onChange={(e) => setFromInputValue(e.target.value)} // Handle onChange
                />
                <input
                    className={cssModule["range-input"]}
                    id="toSlider"
                    type="range"
                    value={toInputValue} // Use value instead of defaultValue
                    min="0"
                    max="230"
                    onChange={(e) => setToInputValue(e.target.value)} // Handle onChange
                />
            </div>
            <div className={cssModule["form_control"]}>
                <div className={cssModule["form_control_container__time"]}>
                    <div className={cssModule["form_control_container__time"]}>
                        Min
                    </div>
                    <input
                        className={
                            cssModule["form_control_container__time__input"]
                        }
                        type="number"
                        id="fromInput"
                        value={fromInputValue} // Use value instead of defaultValue
                        min="0"
                        max="230"
                        onChange={(e) => setFromInputValue(e.target.value)} // Handle onChange
                    />
                </div>
                <div className={cssModule["form_control_container"]}>
                    <div className={cssModule["form_control_container__time"]}>
                        Max
                    </div>
                    <input
                        className={
                            cssModule["form_control_container__time__input"]
                        }
                        type="number"
                        id="toInput"
                        value={toInputValue} // Use value instead of defaultValue
                        min="0"
                        max="230"
                        onChange={(e) => setToInputValue(e.target.value)} // Handle onChange
                    />
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;
