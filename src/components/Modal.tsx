"use client";

import { useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const ref = useRef<null | HTMLDialogElement>(null);

  useEffect(() => {
    ref?.current?.showModal();
  }, []);

  return (
    <dialog ref={ref}>
      <p>inside the dialog</p>
      {children}
    </dialog>
  );
}
