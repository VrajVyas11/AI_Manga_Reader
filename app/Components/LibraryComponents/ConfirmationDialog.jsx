import React from "react";

function ConfirmationDialog({ message, onConfirm, onCancel, isDark }) {
  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center ${isDark ? "bg-black/70" : "bg-gray-200/70"
        } backdrop-blur-sm`}
    >
      <div
        className={`max-w-sm w-full rounded-lg p-6 text-center shadow-lg transition-colors ${isDark
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900 border border-gray-300"
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-desc"
      >
        <p id="confirmation-dialog-desc" className="mb-6 text-base font-medium">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
              : "bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white"
              }`}
            aria-label="Confirm action"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className={`px-5 py-2 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark
              ? "bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 text-white"
              : "bg-gray-300 hover:bg-gray-400 focus:ring-gray-300 text-gray-900"
              }`}
            aria-label="Cancel action"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;