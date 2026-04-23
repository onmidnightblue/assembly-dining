import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (typeof window === "undefined") return null;
  return createPortal(
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="pointer-events-auto animate-bounce-in">
        <div className="flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full shadow-2xl bg-black/10 backdrop-blur-md border-white/10">
          <span>{message}</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
