import React from "react";
import styles from "./index.module.scss";
import Button from "../button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <Button onClick={onConfirm}>Yes</Button>
          <Button onClick={onClose}>No</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
