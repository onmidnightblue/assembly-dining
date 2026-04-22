import { ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const ModalPortal = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 z-100 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
        <div className="relative z-10 grid grid-rows-[max-content_1fr_max-content] w-full max-w-md p-6 overflow-hidden bg-white max-h-5/6 rounded-xl">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="mt-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={closeModal} className="">
              닫기
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return { isOpen, openModal, closeModal, ModalPortal };
};

export default useModal;
