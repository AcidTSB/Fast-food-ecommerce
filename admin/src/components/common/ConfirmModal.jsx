import React, { useEffect, useRef } from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning' or 'info'
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal" ref={modalRef}>
        <div className={`confirm-modal-header ${type}`}>
          <h3>{title}</h3>
          <button className="confirm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="confirm-modal-body">
          <div className={`confirm-modal-icon ${type}-icon`}>
            {type === 'warning' ? '⚠️' : 'ℹ️'}
          </div>
          <p>{message}</p>
          <div className="confirm-modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
            <button className={`btn-confirm ${type}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
export { ConfirmModal };