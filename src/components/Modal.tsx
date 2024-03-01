import { Dialog } from "@headlessui/react";

interface modalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description?: string;
}

export default function Modal({
  children,
  isOpen,
  setIsOpen,
  title,
  description,
}: modalProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* centers the dialogue */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="bg-red-600 px-4 py-4">
          <Dialog.Title className="text-center">{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <button onClick={() => setIsOpen(false)}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
