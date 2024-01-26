import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = (content, duration) => {
    const modalId = Date.now();
    setModals([...modals, { id: modalId, content, duration }]);
    return modalId;
  };

  const closeModal = (modalId) => {
    setModals(modals.filter((modal) => modal.id !== modalId));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
