const ComingSoonPopup = ({handleComingSoonPopupClose}) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Feature Coming Soon!</h2>
          <button
            onClick={handleComingSoonPopupClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Close popup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-300 mb-6 text-center">
          {`We're working hard to bring you this exciting new feature. Stay tuned for updates!`}
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleComingSoonPopupClose}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPopup;