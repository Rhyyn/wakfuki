import React, { useState } from "react";
import Modal from "../Modal/Modal";

const ModalManager = () => {
  const [modals, setModals] = useState([]);

  const openModal = (content) => {
    const modalId = Date.now(); // Unique ID for each modal
    setModals([...modals, { id: modalId, content }]);
  };

  const closeModal = (modalId) => {
    setModals(modals.filter((modal) => modal.id !== modalId));
  };

  return (
    <div>
      {/* Render modals dynamically */}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          showModal={true}
          closeModal={() => closeModal(modal.id)}
          content={modal.content}
        />
      ))}
    </div>
  );
};

export { ModalManager, openModal, closeModal };
