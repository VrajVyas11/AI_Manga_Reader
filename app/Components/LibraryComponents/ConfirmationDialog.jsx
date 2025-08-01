import React from 'react'

function ConfirmationDialog({ message, onConfirm, onCancel }){
    
    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full text-center text-white shadow-lg">
      <p className="mb-6">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          aria-label="Confirm action"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          aria-label="Cancel action"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
}

export default ConfirmationDialog