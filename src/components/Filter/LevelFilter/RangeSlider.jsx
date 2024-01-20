import React, { useState, useEffect, useRef } from "react";
import cssModule from "./RangeSlider.module.scss";
import Image from "next/image";

const RangeSlider = ({ selectedRange, setSelectedRange, resetFiltersFlag }) => {
  const isInitialMount = useRef(true);
  const fromSliderRef = useRef(null);
  const toSliderRef = useRef(null);
  const toSlider = toSliderRef.current;
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromInputValueRef = useRef(0);
  const toInputValueRef = useRef(230);
  const timerRef = useRef(null);
  const [fromInputValue, setFromInputValue] = useState();
  const [toInputValue, setToInputValue] = useState();
  const [fromSliderValue, setFromSliderValue] = useState(0);
  const [toSliderValue, setToSliderValue] = useState(230);
  const [tempFromInputValue, setTempFromInputValue] = useState(0);
  const [tempToInputValue, setTempToInputValue] = useState(230);
  const [manualReset, setManualReset] = useState(false);

  // TODO
  // Disable string in inputs
  // Disable negative values
  // Fix Slider having wrong value by manually typing
  // toValue > fromValue
  // input value sometimes not updating after typing and using sliders

  // const controlFromInput = (fromSlider, fromInput, toInput) => {
  //   const [from, to] = getParsed(fromInput, toInput);

  //   // fillSlider(fromInput, toInput, "#615a49", "#292621", toSlider);

  //   if (from > to) {
  //     fromSlider.defaultValue = to;
  //     fromInput.defaultValue = to;
  //     setFromInputValue(to);
  //   } else {
  //     fromSlider.defaultValue = from;
  //     fromInput.defaultValue = from;
  //     setToInputValue(from);
  //   }

  //   if (parseInt(fromInput.defaultValue, 10) > to) {
  //     fromInput.defaultValuevalue = to;
  //     fromSlider.value = to;
  //   }
  // };

  // const controlToInput = (toSlider, fromInput, toInput) => {
  //   const [from, to] = getParsed(fromInput, toInput);
  //   console.log(`Inside controlToInput : `);
  //   console.log("toSlider : ", toSlider.value);
  //   console.log("fromInput : ", fromInput.value);
  //   console.log("toInput : ", toInput.value);

  //   if (toInput.value < fromInput.value) {
  //     console.log("here");
  //     toInput.value = fromInput.value;
  //   }

  //   // fillSlider(fromInput, toInput, "#615a49", "#292621", toSlider);
  //   setToggleAccessible(toInput);

  //   toInput.onchange = () => {
  //     // const inputValue = parseInt(toInput.defaultValue, 10);
  //     console.log(toInputValue);
  //     const inputValue = toInputValue;
  //     if (inputValue < from) {
  //       toInput.defaultValue = from;
  //       // toSlider.value = from;
  //       setToInputValue(from);
  //     } else if (inputValue > to) {
  //       toInput.defaultValue = to;
  //       // toSlider.value = to;
  //       setToInputValue(to);
  //     }
  //   };
  // };

  const controlFromSlider = () => {
    const [from, to] = getParsedValues();

    if (from >= to) {
      fromSliderRef.current.value = to;
      fromInputRef.current.value = to;
      setFromInputValue(to);
      setFromSliderValue(to);
    } else {
      fromInputRef.current.value = from;
      fromSliderRef.current.value = from;
      setFromInputValue(from);
      setFromSliderValue(from);
      // if (parseInt(toSliderRef.current.value, 10) == 230) {
      //   fromInputRef.current.value = from;
      //   fromSliderRef.current.value = from;
      //   setToInputValue(from);
      //   setFromSliderValue(from);
      // } else {
      //   fromInputRef.current.value = from;
      //   fromSliderRef.current.value = from - 10;
      //   setToInputValue(from - 10);
      //   setFromSliderValue(from - 10);
      // }
    }
    fillSlider(fromSliderRef, toSliderRef, "#615a49", "#292621");
  };

  const controlToSlider = () => {
    const [from, to] = getParsedValues();

    // setToggleAccessible(toSlider);

    if (from <= to) {
      toSliderRef.current.value = to;
      toInputRef.current.value = to;
      setToInputValue(to);
      setToSliderValue(to);
      // fromSliderRef.current.max(toSliderValue - 10);
      // fromSliderRef.current.minx(-10);
    } else {
      toInputRef.current.value = from;
      toSliderRef.current.value = from;
      setToInputValue(from);
      setToSliderValue(from);
    }
    fillSlider(fromSliderRef, toSliderRef, "#615a49", "#292621");
  };

  const getParsedValues = () => {
    const from = parseInt(fromSliderRef.current.value, 10);
    const to = parseInt(toSliderRef.current.value, 10);
    return [from, to];
  };

  const fillSlider = (fromSlider, toSlider, sliderColor, rangeColor) => {
    // let maxRange = parseInt(toSlider.current.max, 10);
    let maxRange = 230;
    let fromPosition = parseInt(fromSlider.current.value, 10);
    let toPosition = parseInt(toSlider.current.value, 10);

    toSlider.current.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition / maxRange) * 100}%,
            ${rangeColor} ${(fromPosition / maxRange) * 100}%,
            ${rangeColor} ${(toPosition / maxRange) * 100}%, 
            ${sliderColor} ${(toPosition / maxRange) * 100}%, 
            ${sliderColor} 100%)`;
  };

  // const setToggleAccessible = (currentTarget) => { // maybe use for z fighting
  //   const toSlider = document.querySelector("#toSlider");
  //   if (Number(currentTarget.value) <= 0) {
  //     toSlider.style.zIndex = 2;
  //   } else {
  //     toSlider.style.zIndex = 0;
  //   }
  // };

  useEffect(() => {
    fillSlider(fromSliderRef, toSliderRef, "#615a49", "#292621");

    // const fromSlider = document.querySelector("#fromSlider");
    // const toSlider = document.querySelector("#toSlider");
    // const fromInput = document.querySelector("#fromInput");
    // const toInput = document.querySelector("#toInput");

    // fromSliderRef.current = fromSlider;
    // toSliderRef.current = toSlider;
    // fromInputRef.current = fromInput;
    // toInputRef.current = toInput;

    // setToggleAccessible(toSliderRef.current);

    // fromSlider.oninput = () => {
    //   const fromValue = parseInt(fromSlider.value, 10);
    //   const toValue = parseInt(toSlider.value, 10);
    //   // Ensure the left thumb cannot go past the right thumb
    //   if (fromValue >= toValue) {
    //     fromSlider.value = toValue;
    //   }
    //   setFromInputValue(fromInputValueRef.current);
    //   controlFromSlider(fromSlider, toSlider, fromInput);
    // };

    // toSlider.oninput = () => {
    //   const fromValue = parseInt(fromSlider.value, 10);
    //   const toValue = parseInt(toSlider.value, 10);

    //   // console.log("fromValue ", fromValue);
    //   // console.log("toValue ", toValue);

    //   // Ensure the right thumb cannot go past the left thumb
    //   if (toValue <= fromValue) {
    //     toSlider.value = fromValue;
    //     // setToInputValue(fromValue);
    //   }
    //   controlToSlider(fromSlider, toSlider, toInput);
    // };

    // fromInput.oninput = () =>
    //   controlFromInput(fromSlider, fromInput, toInput, toSlider);
    // toInput.oninput = () => controlToInput(toSlider, fromInput, toInput);
  }, []);

  // useEffect(() => {
  //   // const fillSlider = (from, to, sliderColor, rangeColor, toSlider) => {
  //   // && toSliderRef.current != null ?
  //   let from = { value: selectedRange.from };
  //   let to = { max: 230, value: selectedRange.to };
  //   setFromInputValue(selectedRange.from);
  //   setToInputValue(selectedRange.to);
  //   fillSlider(from, to, "#615a49", "#292621", toSliderRef.current);
  // }, [selectedRange]);

  const handleMouseUpEvent = (e) => {
    setSelectedRange({ from: fromSliderValue, to: toSliderValue });
  };

  useEffect(() => {
    // toSliderRef.current.style.zIndex = 2;
    fromSliderRef.current.style.zIndex = 1;
  }, [toSliderValue]);

  useEffect(() => {
    fromSliderRef.current.style.zIndex = 2;
    // toSliderRef.current.style.zIndex = 1;
  }, [fromSliderValue]);

  // const handleSelectedRange = () => {
  //   const rangeObject = {
  //     from: fromInputValueRef.current,
  //     to: toInputValueRef.current,
  //   };
  //   setSelectedRange(rangeObject);
  // };

  // const isInputValidNumber = (input) => {
  //   let parsedInput = parseInt(input.target.value);
  //   if (!typeof parsedInput == "number") {
  //     return false;
  //   } else if (input.target.id == "fromInput" && parsedInput < 0) {
  //     return false;
  //   } else if (input.target.id == "toInput" && parsedInput > 0) {
  //     return false;
  //   }
  //   return true;
  // };

  // useEffect(() => {}, [fromInputValue]);

  // useEffect(() => {
  //   setManualReset(false);

  //   controlFromSlider(fromSliderRef, toSliderRef, fromInputRef);
  //   controlToSlider(fromSliderRef.current, toSliderRef.current, toInputRef.current);

  //   setFromInputValue(0);
  //   setToInputValue(230);
  //   fromInputValueRef.current = 0;
  //   toInputValueRef.current = 230;
  // }, [resetFiltersFlag, manualReset]);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue.startsWith("-")) {
      inputValue = inputValue.slice(1);
      console.log(inputValue);
    }
    let replacedValue = inputValue.replace(/[^0-9]/g, "");

    if (e.target.id == "fromInput") {
      if (replacedValue < 0) {
        replacedValue = 0;
      }
      setFromInputValue(replacedValue);
    }

    if (e.target.id == "toInput") {
      clearTimeout(timerRef.current);
      if (replacedValue > 0) {
        timerRef.current = setTimeout(() => {
          let fromInputValueLength = fromInputRef.current.value.length;
          console.log(replacedValue, ">", fromInputValue);
          console.log("replacedValue.length", replacedValue.length);
          console.log("fromInputValueLength", fromInputValueLength);
          if ( // is bigger or equal to from , compare numbers --- maybe max = 3
            replacedValue.length >= fromInputValueLength &&
            replacedValue < fromInputValue
          ) { 
            console.log("trigger");
            replacedValue = 230;
          } else if (replacedValue.length <= fromInputValueLength) { // is smaller or equal to from, trigger error set to 230
            console.log("erggirt");
          }
        }, 1000);
      }
      setToInputValue(replacedValue);
    }
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
            min={0}
            max={230}
            step={5}
            placeholder={0}
            ref={fromInputRef}
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
            // onChange={(e) => setFromSliderValue(e.target.value)}
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
