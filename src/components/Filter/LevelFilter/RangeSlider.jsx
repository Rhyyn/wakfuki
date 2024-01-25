import React, { useState, useEffect, useRef } from "react";
import cssModule from "./RangeSlider.module.scss";

const RangeSlider = ({
  selectedRange,
  setSelectedRange,
  resetFiltersFlag,
  handleShowModal,
  displayedTextRef
}) => {
  const fromSliderRef = useRef(null);
  const toSliderRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const timerRef = useRef(null);
  const [fromInputValue, setFromInputValue] = useState(0);
  const [toInputValue, setToInputValue] = useState(230);
  const [fromSliderValue, setFromSliderValue] = useState(0);
  const [toSliderValue, setToSliderValue] = useState(230);

  // TODO
  // Create error modal

  const controlFromSlider = () => {
    const [from, to] = getParsedValues();

    if (from >= to) {
      setFromInputValue(to);
      setFromSliderValue(to);
    } else {
      setFromInputValue(from);
      setFromSliderValue(from);
    }
    fillSlider(from, to);
  };

  const controlToSlider = () => {
    const [from, to] = getParsedValues();

    if (from <= to) {
      setToInputValue(to);
      setToSliderValue(to);
    } else {
      setToInputValue(from);
      setToSliderValue(from);
    }
    fillSlider(from, to);
  };

  const getParsedValues = () => {
    const from = parseInt(fromSliderRef.current.value, 10);
    const to = parseInt(toSliderRef.current.value, 10);
    return [from, to];
  };

  const fillSlider = (from, to) => {
    let maxRange = 230;
    let fromPosition = from;
    let toPosition = to;
    let sliderColor = "#615a49";
    let rangeColor = "#292621";

    toSliderRef.current.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition / maxRange) * 100}%,
            ${rangeColor} ${(fromPosition / maxRange) * 100}%,
            ${rangeColor} ${(toPosition / maxRange) * 100}%, 
            ${sliderColor} ${(toPosition / maxRange) * 100}%, 
            ${sliderColor} 100%)`;
  };

  const handleMouseUpEvent = () => {
    setSelectedRange({ from: fromSliderValue, to: toSliderValue });
  };

  const isNumberInRange = (minValue, maxValue, currValue) => {
    return currValue >= minValue && currValue <= maxValue;
  };

  const checkIfHasInput = (e) => {
    // making sure we always have something in input field
    if (e.target.value) {
      return;
    } else if (e.target.id === "fromInput") {
      setFromInputValue(0);
      setFromSliderValue(0);
      fillSlider(0, toInputValue);
    } else if (e.target.id === "toInput") {
      setToInputValue(230);
      setToSliderValue(230);
      fillSlider(fromInputValue, 230);
    }
  };

  const isInputLengthValid = (input) => {
    if (input) {
      if (input.length > 3) {
        return false;
      }
      return true;
    }
    return false;
  };

  const isInputValid = (input, minValue, maxValue) => {
    if (input) {
      if (input >= minValue && input <= maxValue) {
        return true;
      }
      return false;
    }
    return false;
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue.startsWith("-")) {
      inputValue = inputValue.slice(1);
    }
    let newInput = parseInt(inputValue.replace(/[^0-9]/g, ""), 10);
    clearTimeout(timerRef.current);
    let minValue, maxValue, setInputFunction, setSliderFunction, defaultValue;

    if (e.target.id === "fromInput") {
      defaultValue = 0;
      minValue = 0;
      maxValue = toInputValue;
      setInputFunction = setFromInputValue;
      setSliderFunction = setFromSliderValue;
    } else if (e.target.id === "toInput") {
      defaultValue = 230;
      minValue = fromInputValue;
      maxValue = 230;
      setInputFunction = setToInputValue;
      setSliderFunction = setToSliderValue;
    } else {
      console.log("Error while capturing the user input");
      // Pop up modal error
    }
    setInputFunction(newInput);

    timerRef.current = setTimeout(() => {
      if (
        isInputLengthValid(newInput) &&
        isInputValid(newInput, minValue, maxValue)
      ) {
        setInputFunction(newInput);
        setSliderFunction(newInput);
        const updatedMinValue =
          e.target.id === "fromInput" ? newInput : minValue;
        const updatedMaxValue = e.target.id === "toInput" ? newInput : maxValue;
        fillSlider(updatedMinValue, updatedMaxValue);
        return;
      }
      // handleShowModal();
      console.log(displayedTextRef);
      displayedTextRef.current = "STETTT"
      setInputFunction(defaultValue);
      setSliderFunction(defaultValue);
      const updatedMinValue =
        e.target.id === "fromInput" ? defaultValue : minValue;
      const updatedMaxValue =
        e.target.id === "toInput" ? defaultValue : maxValue;
      fillSlider(updatedMinValue, updatedMaxValue);
      // Pop up modal error
    }, 600);
  };

  useEffect(() => {
    fillSlider(fromSliderValue, toSliderValue);
  }, []);

  // sets the last used thumb on top
  // prevents overlapping
  useEffect(() => {
    let minValue = fromSliderValue;
    let maxValue = fromSliderValue + 2;
    if (isNumberInRange(minValue, maxValue, toSliderValue)) {
      fromSliderRef.current.style.zIndex = 1;
      toSliderRef.current.style.zIndex = 2;
    } else {
      fromSliderRef.current.style.zIndex = 2;
      toSliderRef.current.style.zIndex = 1;
    }
  }, [toSliderValue]);

  // Triggered when user sets a level range by using
  // the dropdown in LevelFilter
  useEffect(() => {
    let fromValue = selectedRange.from;
    let toValue = selectedRange.to;
    setFromInputValue(fromValue);
    setToInputValue(toValue);
    setFromSliderValue(fromValue);
    setToSliderValue(toValue);
    fillSlider(fromValue, toValue);
  }, [selectedRange]);

  // Triggered when reset button is clicked
  useEffect(() => {
    setFromInputValue(0);
    setToInputValue(230);
    setFromSliderValue(0);
    setToSliderValue(230);
    fillSlider(0, 230);
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["level-filter-container"]}>
      <div className={cssModule["form_control"]}>
        <div className={cssModule["form_control_container__time"]}>
          <input
            className={cssModule["form_control_container__time__input"]}
            type="number"
            id="fromInput"
            value={fromInputValue}
            min={0}
            max={230}
            step={5}
            placeholder={0}
            ref={fromInputRef}
            onFocus={() => setFromInputValue("")}
            onBlur={(e) => checkIfHasInput(e)}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className={cssModule["form_control_container__time"]}>
          <input
            className={cssModule["form_control_container__time__input"]}
            dir="rtl"
            type="number"
            id="toInput"
            value={toInputValue}
            min={0}
            max={230}
            step={5}
            placeholder={230}
            ref={toInputRef}
            onFocus={() => setToInputValue("")}
            onBlur={(e) => checkIfHasInput(e)}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className={cssModule["range_container"]}>
        <div className={cssModule["sliders_control"]}>
          <input
            className={`${cssModule["range-input"]} ${cssModule["thumb-1"]}`}
            id="fromSlider"
            style={{
              height: 0,
              zIndex: 1,
            }}
            type="range"
            value={fromSliderValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => controlFromSlider(e)}
            onMouseUp={(e) => handleMouseUpEvent(e)}
            ref={fromSliderRef}
          />
          <input
            className={`${cssModule["range-input"]} ${cssModule["thumb-2"]}`}
            id="toSlider"
            type="range"
            value={toSliderValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => controlToSlider(e)}
            onMouseUp={(e) => handleMouseUpEvent(e)}
            ref={toSliderRef}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
