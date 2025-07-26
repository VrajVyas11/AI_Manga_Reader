import React from 'react';
import { Image } from 'lucide-react';

const Placeholder = ({ isDark = true }) => {
  return (
    <div role="status" className="w-[380px] mt-5 h-[83vh]">
      <style global="jsx">{`
        @keyframes colorShift {
          0% {
            background-color: ${isDark ? '#1e293b99' : '#e5e7eb99'}; /* Tailwind gray-800 or gray-200 */
          }
          100% {
            background-color: ${isDark ? '#11182799' : '#f3f4f699'}; /* Tailwind gray-700 or gray-100 */
          }
        }
      `}</style>
      <div
        className={`
          w-[400px] h-[83vh] backdrop-blur-2xl rounded-lg mb-5 flex justify-center items-center
          transition-all duration-75 ease-in-out
          ${isDark ? '' : 'border border-gray-300'}
        `}
        style={{
          animation: 'colorShift 1.5s ease-in-out infinite alternate',
        }}
      >
        <Image
          className={`${isDark ? 'stroke-gray-400' : 'stroke-gray-600'}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Placeholder;