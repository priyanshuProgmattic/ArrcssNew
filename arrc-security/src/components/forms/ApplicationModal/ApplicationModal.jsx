import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ApplicationForm from '../ApplicationForm/ApplicationForm';
import Icon from '../../common/Icon/Icon';
import './ApplicationModal.css';

export default function ApplicationModal({ category, onClose }) {
  const dialogRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector('select')?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  function close() {
    if (!submitting) dialogRef.current?.close();
  }

  function clickBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  }

  function keepFocusInside(event) {
    if (event.key !== 'Tab') return;
    const controls = [
      ...event.currentTarget.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      ),
    ].filter((control) => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return createPortal(
    <dialog
      id="career-application-modal"
      className="application-modal"
      ref={dialogRef}
      aria-labelledby="application-modal-title"
      aria-describedby="application-modal-category"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onCancel={(event) => {
        if (submitting) event.preventDefault();
      }}
      onClick={clickBackdrop}
      onKeyDown={keepFocusInside}
    >
      <div className="application-modal__header">
        <h2 id="application-modal-title">Apply for a job</h2>
        <p id="application-modal-category">{category.title} application</p>
        <button
          type="button"
          className="application-modal__close"
          aria-label="Close application"
          disabled={submitting}
          onClick={close}
        >
          <Icon name="X" size={20} />
        </button>
      </div>
      <ApplicationForm category={category} onCancel={close} onSubmittingChange={setSubmitting} />
    </dialog>,
    document.body,
  );
}
