import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({ title, children, isOpen, closeModal }: Props) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-100 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div
        className={
          "relative z-10 grid grid-rows-[max-content_1fr_max-content] w-full max-w-md p-6 overflow-hidden bg-white max-h-5/6 rounded-xl"
        }
      >
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

export default Modal;
