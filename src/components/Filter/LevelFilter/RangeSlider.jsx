import React, { useState, useEffect, useRef } from "react";
import cssModule from "./RangeSlider.module.scss";
import Image from "next/image";

const RangeSlider = ({ selectedRange, setSelectedRange }) => {
  const isInitialMount = useRef(true);
  const fromSliderRef = useRef(null);
  const toSliderRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromValueRef = useRef(0);
  const toValueRef = useRef(230);
  const [fromInputValue, setFromInputValue] = useState(0);
  const [toInputValue, setToInputValue] = useState(230);

  // TODO
  // Disable string in inputs
  // Fix Slider having wrong value by manually typing
  // toValue > fromValue

  const controlFromInput = (fromSlider, fromInput, toInput) => {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, "#615a49", "#292621", toSlider);

    if (from > to) {
      fromSlider.defaultValue = to;
      fromInput.defaultValue = to;
    } else {
      fromSlider.value = from;
      fromInput.defaultValue = from;
    }

    if (parseInt(fromInput.value, 10) > to) {
      fromInput.value = to;
      fromSlider.value = to;
    }
  };

  const controlToInput = (toSlider, fromInput, toInput) => {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, "#615a49", "#292621", toSlider);
    setToggleAccessible(toInput);

    if (from <= to) {
      toSlider.defaultValue = to;
      toInput.defaultValue = to;
    } else {
      toInput.defaultValue = from;
    }

    toInput.onchange = () => {
      const inputValue = parseInt(toInput.value, 10);
      if (inputValue < from) {
        toInput.value = from;
        toSlider.value = from;
      } else if (inputValue > to) {
        toInput.value = to;
        toSlider.value = to;
      }
    };
  };

  const controlFromSlider = (fromSlider, toSlider, fromInput) => {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, "#615a49", "#292621", toSlider);

    // console.log("from", from);
    // console.log("to", to);
    // console.log("fromInput", fromInput);

    setFromInputValue(from);

    if (from > to) {
      fromSlider.defaultValue = to;
      fromInput.defaultValue = to;
    } else {
      fromInput.defaultValue = from;
    }
  };

  const controlToSlider = (fromSlider, toSlider, toInput) => {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, "#615a49", "#292621", toSlider);
    setToggleAccessible(toSlider);
    setToInputValue(to);
    // console.log("fromSlider", from);
    // console.log("toSlider", to);
    // console.log("toInput", toInput);
    if (from <= to) {
      toSlider.defaultValue = to;
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

  const fillSlider = (from, to, sliderColor, rangeColor, toSlider) => {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;

    // console.log('From Position:', fromPosition);
    // console.log('rangeDistance',rangeDistance);
    // console.log('To Position:', toPosition);

    toSlider.style.background = `linear-gradient(
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

    fromSliderRef.current = fromSlider;
    toSliderRef.current = toSlider;
    fromInputRef.current = fromInput;
    toInputRef.current = toInput;

    fillSlider(fromSlider, toSlider, "#615a49", "#292621", toSlider);
    setToggleAccessible(toSlider);

    fromSlider.oninput = () => {
      const fromValue = parseInt(fromSlider.value, 10);
      const toValue = parseInt(toSlider.value, 10);
      // Ensure the left thumb cannot go past the right thumb
      if (fromValue >= toValue) {
        fromSlider.value = toValue;
      }

      controlFromSlider(fromSlider, toSlider, fromInput);
    };

    toSlider.oninput = () => {
      const fromValue = parseInt(fromSlider.value, 10);
      const toValue = parseInt(toSlider.value, 10);

      // Ensure the right thumb cannot go past the left thumb
      if (toValue <= fromValue) {
        toSlider.value = fromValue;
      }

      controlToSlider(fromSlider, toSlider, toInput);
    };

    fromInput.oninput = () =>
      controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () =>
      controlToInput(toSlider, fromInput, toInput, toSlider);
  }, []);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //     return;
  //   }

  //   const rangeObject = {
  //     from: fromInputValue,
  //     to: toInputValue,
  //   };
  //   setSelectedRange(rangeObject);
  // }, [fromInputValue, toInputValue]);

  useEffect(() => {
    if (!isInitialMount.current && toSliderRef.current != null) {
      setFromInputValue(selectedRange.from);
      setToInputValue(selectedRange.to);
      fillSlider(
        fromSliderRef.current,
        toSliderRef.current,
        "#615a49",
        "#292621",
        toSliderRef.current
      );
    }
  }, [selectedRange]);

  const handleMouseUpEvent = (e) => {
    const rangeObject = {
      from: fromInputValue,
      to: toInputValue,
    };
    setSelectedRange(rangeObject);
    // if (e.target.attributes[1].nodeValue == "fromSlider") {
    //   console.log("fromSlider");
    //   console.log(e.target.value);
    //   setFromInputValue(e.target.value);
    // } else if (e.target.attributes[1].nodeValue == "toSlider") {
    //   console.log("toSlider");
    //   console.log(e.target.value);
    //   setToInputValue(e.target.value);
    // }
  };

  return (
    <div className={cssModule["level-filter-container"]}>
      <div className={cssModule["form_control"]}>
        <div className={cssModule["form_control_container__time"]}>
          <input
            className={cssModule["form_control_container__time__input"]}
            type="number"
            id="fromInput"
            value={fromInputValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => setFromInputValue(e.target.value)}
          />
        </div>
        <div className={cssModule["form_control_container__time"]}>
          <input
            className={cssModule["form_control_container__time__input"]}
            dir="rtl"
            type="number"
            id="toInput"
            value={toInputValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => setToInputValue(e.target.value)}
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
            defaultValue={fromInputValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => setFromInputValue(e.target.value)}
            onMouseUp={() => handleMouseUpEvent()}
          />
          <input
            className={`${cssModule["range-input"]} ${cssModule["thumb-2"]}`}
            id="toSlider"
            type="range"
            defaultValue={toInputValue}
            min="0"
            max="230"
            step={5}
            onChange={(e) => setToInputValue(e.target.value)}
            onMouseUp={() => handleMouseUpEvent()}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
