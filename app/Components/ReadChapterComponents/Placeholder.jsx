import React from 'react'
import { Image } from "lucide-react";

const Placeholder = () => {
    return (
        <div role="status" className="w-[380px] mt-5 h-[83vh]">

            <style global="jsx">{`
        @keyframes colorShift {
          0% {
            background-color: #1e293b99; /* Tailwind gray-800 */
          }
          100% {
            background-color: #11182799; /* Tailwind gray-700 */
          }
        }
      `}</style>
            <div
                className="w-[400px] h-[83vh] backdrop-blur-2xl  rounded-lg mb-5 flex justify-center items-center transition-all duration-75 ease-in-out"
                style={{
                    animation: 'colorShift 1.5s ease-in-out infinite alternate',
                }}
            >
                <Image className="w-8 h-8 stroke-gray-400" />
            </div>
        </div>
    )
}

export default Placeholder