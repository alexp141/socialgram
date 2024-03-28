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
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* centers the dialogue */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-scroll">
        <Dialog.Panel className="bg-zinc-100 dark:bg-gray-950 dark:outline border-2 rounded-lg px-8 py-12 max-h-[95vh] overflow-y-scroll  relative">
          <Dialog.Title className="text-center text-2xl mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full px-2 py-2 mt-4 absolute top-0 right-4 text-red-700"
          >
            Cancel
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
