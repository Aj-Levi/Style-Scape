"use client";

import React, { useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface ModalProps {
    IsOpen: boolean;
    setIsOpen: (val: boolean) => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
    IsOpen,
    setIsOpen,
    title,
    children,
    size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      console.log("before set",IsOpen);
      setIsOpen(false);
      console.log("after set",IsOpen);

    }
  };

  if (!IsOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative bg-base-100 rounded-lg shadow-xl transform transition-all duration-300 ${sizeClasses[size]} w-full mx-4`}
      >
        <div className="p-4 border-b border-base-300">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={(e) => {
              console.log("hello")
              e.stopPropagation();
              setIsOpen(false)
            }}
            aria-label="Close"
          >
            <IoCloseSharp size={25} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
