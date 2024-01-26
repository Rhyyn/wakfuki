import React, { useEffect, useRef, useState, useCallback } from "react";
import { useModal } from "./ModalContext";
import cssModule from "./Modal.module.scss";
import { useSpring, animated, config } from "react-spring";

const Modal = () => {
  const { modals, closeModal } = useModal();
  const initialDurationRef = useRef();
  const animationFrameRef = useRef();
  const intervalRef = useRef();
  const remainingTimeRef = useRef();
  const [testValue, setTestValue] = useState();

  const updateProgress = (startTime) => {
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const remainingTime = initialDurationRef.current - elapsedTime;
      remainingTimeRef.current = remainingTime;
      if (remainingTimeRef.current > 0) {
        const percent = (remainingTime / initialDurationRef.current) * 100;
        setTestValue(percent);
      } else {
        clearInterval(intervalRef.current);
        cancelAnimationFrame(animationFrameRef.current);
      }
    }, 80);

    const update = () => {
      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  };

  useEffect(() => {
    if (modals.length > 0) {
      setTestValue(100);
      const { id, duration } = modals[0];
      let fixPercent = (duration * 0.06) // Used to get a better visual on the end of the slider
      initialDurationRef.current = (duration - fixPercent);
      const startTime = Date.now();
      updateProgress(startTime);
      let timeoutId;
      timeoutId = setTimeout(() => {
        closeModal(id);
      }, duration);

      return () => {
        clearInterval(intervalRef.current);
        cancelAnimationFrame(animationFrameRef.current);
        clearTimeout(timeoutId);
      };
    }
  }, [modals, closeModal]);

  const progress = useSpring({
    width: testValue,
    from: { width: 100 },
    config: config.slow,
  });

  return (
    <React.Fragment>
      {modals.map((modal) => (
        <div className={cssModule["modal-container"]} key={modal.id}>
          <div className={cssModule["modal-text"]}>{modal.content}</div>
          <div className={cssModule["duration-slider"]}>
            {/* <div ref={progressBarRef} className={cssModule["slider-fill"]}> */}
            <animated.div
              className={cssModule["slider-fill"]}
              style={{
                width: progress.width.to((width) => `${width}%`),
              }}
            ></animated.div>
            {/* </div> */}
          </div>
          {/* <button onClick={() => closeModal(modal.id)}>Close Modal</button> */}
        </div>
      ))}
    </React.Fragment>
  );
};

export default Modal;
