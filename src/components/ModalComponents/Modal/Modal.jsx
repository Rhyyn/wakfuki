import React, { useEffect, useRef, useState, useCallback } from "react";
import { useModal } from "./ModalContext";
import cssModule from "./Modal.module.scss";

const Modal = () => {
  const { modals, closeModal } = useModal();
  const initialDurationRef = useRef();
  const animationFrameRef = useRef();
  const intervalRef = useRef();
  const remainingTimeRef = useRef();
  const progressBarRef = useRef();

  const updateProgress = (startTime) => {
    
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const remainingTime = initialDurationRef.current - elapsedTime;
      remainingTimeRef.current = remainingTime
      if (remainingTimeRef.current > 0) {
        const percent = Math.round((remainingTime / initialDurationRef.current) * 100);
        console.log(percent);
        progressBarRef.current.style.width = `${percent}%`
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
      const { id, duration } = modals[0];
      initialDurationRef.current = duration;
      const startTime = Date.now();
      updateProgress(startTime);

      setTimeout(() => {
        closeModal(id);
      }, duration);

      return () => {
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [modals]);

  return (
    <React.Fragment>
      {modals.map((modal) => (
        <div className={cssModule["modal-container"]} key={modal.id}>
          <div className={cssModule["modal-text"]}>{modal.content}</div>
          <div className={cssModule["duration-slider"]}>
            <div
              ref={progressBarRef}
              className={cssModule["slider-fill"]}
            ></div>
          </div>
          {/* <button onClick={() => closeModal(modal.id)}>Close Modal</button> */}
        </div>
      ))}
    </React.Fragment>
  );
};

export default Modal;
