import { useCallback, useEffect, useState } from "react";

export const useModal = <T,>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((item: T) => {
    setData(item);
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setData(null);
    }, 300);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return { isOpen, data, openModal, closeModal };
};

export default useModal;
