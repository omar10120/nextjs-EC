// src/Component/Modal.js
export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        
        {/* Modal Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  