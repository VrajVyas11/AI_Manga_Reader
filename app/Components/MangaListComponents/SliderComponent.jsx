"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Flag from "react-world-flags";
import { motion } from "framer-motion";

const stagger = 0.2;
const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};
const langToCountry = { ja: "JP", ms: "MY", ko: "KR", en: "US", zh: "CN" };

const SliderComponent = ({ processedRandomMangas, handleMangaClicked }) => {
    const [visibleMangas, setVisibleMangas] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const autoPlayRef = useRef(null);
    useEffect(() => {
        setVisibleMangas(processedRandomMangas.slice(0, 5));
        autoPlayRef.current = setInterval(handleNext, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [processedRandomMangas]);

    const handleNext = () => {
        setVisibleMangas((prev) => {
            const nextIndex = (processedRandomMangas.indexOf(prev[4]) + 1) % processedRandomMangas.length;
            return [...prev.slice(1), processedRandomMangas[nextIndex]];
        });
    };

    const handlePrev = () => {
        setVisibleMangas((prev) => {
            const prevIndex = (processedRandomMangas.indexOf(prev[0]) - 1 + processedRandomMangas.length) % processedRandomMangas.length;
            return [processedRandomMangas[prevIndex], ...prev.slice(0, 4)];
        });
    };

    return (
        <div className="w-full overflow-hidden text-white font-sans px-10  pb-10 pt-7">
            <div className=" flex mb-5  relative justify-center items-center w-full px-10 ">
                <h1 className=" relative h-16 gap-5   flex z-10 px-8 justify-center items-center [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]  scale-[102%] backdrop-blur-3xl w-fit text-xl font-bold text-purple-200 tracking-wide uppercase   bg-[#2b045a]">
                    <img
                        src="/random.png"
                        alt="random"
                        className=" w-10 h-10 filter invert brightness-200 contrast-200"
                    />
                    Randomized Recomendation
                    <img
                        src="/random.png"
                        alt="random"
                        className=" w-10 h-10 rotate-180 filter invert brightness-200 contrast-200"
                    />
                </h1>
                <div
                    className="flex  justify-center items-center h-[70px] scale-x-[140%] absolute   w-96 antialiased px-12 overflow-visible  bg-[#7a1feab5] backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono  py-4 text-3xl font-bold text-purple-200 tracking-wide uppercase ">

                </div>
                {/* 2nd */}
                <div
                    className="flex -z-10 justify-center items-center h-14 scale-x-[160%] absolute   w-96 antialiased px-12 overflow-visible  bg-[#7a23e6b5]  backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono  py-4 text-3xl font-bold text-purple-200 tracking-wide uppercase ">

                </div>
                <div
                    className="flex -z-10 justify-center items-center h-12 scale-x-[155%] absolute   w-96 antialiased px-12 overflow-visible  bg-[#2d055d]  backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono  py-4 text-3xl font-bold text-purple-200 tracking-wide uppercase ">

                </div>
                {/* 3rd */}
                <div
                    className="flex -z-10 justify-center items-center h-8  scale-x-[103%] absolute  w-[50%] antialiased px-12 overflow-visible  bg-[#e6e023b5]  backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono   text-3xl font-bold text-purple-200 tracking-wide uppercase ">
                </div>
                <div
                    className="flex -z-10 justify-center items-center h-6   absolute  w-[50%] antialiased px-12 overflow-visible  bg-[#5b6106]  backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono   text-3xl font-bold text-purple-200 tracking-wide uppercase ">
                </div>
                {/* 4th */}
                {/* <div
                    className="flex -z-30 justify-center items-center h-4  scale-x-[103%] absolute w-[85%] antialiased px-12 overflow-visible  bg-[#e6e023b5]  backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono   text-3xl font-bold text-purple-200 tracking-wide uppercase ">
                </div>
                <div
                    className="flex -z-30 justify-center items-center h-2  absolute w-[85%] antialiased px-12 overflow-visible  bg-[#5b6106] backdrop-blur-3xl  transition  [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)]   font-mono   text-3xl font-bold text-purple-200 tracking-wide uppercase ">
                </div> */}
            </div>

            <section className="carousel flex justify-center w-full items-center relative gap-4">
                <span
                    onClick={() => handlePrev()}
                    className={`relative cursor-pointer brightness-150 shadow-[0px_0px_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-7 rounded-xl overflow-hidden
                                      before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                                    `}
                    style={{
                        background: "linear-gradient(#3b235a, #24143f)",
                    }}
                >
                    <Image className=" brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />
                </span>
                <div className="list flex w-full  justify-between  gap-2 items-center overflow-hidden">
                    {visibleMangas.map((manga, index) => (
                        <motion.div
                            key={manga.id}
                            onClick={() => handleMangaClicked(manga)}
                            className="relative"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.5 * stagger, ease: "easeInOut", duration: 0.5 }}
                        >
                            <div
                                className=" absolute z-10 [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)] w-[250px] mt-[9px] antialiased   -ml-[3px] h-[355px] overflow-visible  bg-purple-950 hover:scale-105 transition "></div>
                            <div
                                key={index}
                                className="relative my-4 z-20 [clip-path:polygon(0_0,0_0,3%_49%,0_100%,0_100%,49%_97%,100%_100%,100%_100%,97%_51%,100%_0,100%_0,49%_3%)] w-[245px] h-[340px]  bg-purple-900 hover:scale-105 transition  border-stones-500 border-opacity-70"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Image className="w-full h-full object-cover" src={manga.coverImageUrl} alt={manga.title} width={220} height={340} loading="lazy" />
                                {/* Title Always Visible */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent p-4">
                                    <h1 className=" w-full flex-nowrap flex flex-row font-bold items-start justify-center text-xs tracking-[2px] text-white">
                                        <Flag code={langToCountry[manga.originalLanguage] || "UN"} className="w-6 shadow-lg shadow-black  mr-4" />
                                        {manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title}
                                    </h1>

                                </div>

                                {/* Description on Hover */}
                                {hoveredIndex === index && (
                                    <div className="absolute inset-0 flex flex-col justify-start p-4 bg-purple-950 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg transition-opacity duration-300">
                                        <div className="absolute inset-x-0 top-0 bg-gradient-to-t from-transparent via-stone-900 to-stone-950 p-4">
                                            <h1 className=" w-full mt-3 flex-nowrap flex flex-row font-extrabold items-start justify-center text-xs tracking-[2px]  text-white">
                                                <Flag code={langToCountry[manga.originalLanguage] || "UN"} className="w-6 shadow-lg shadow-black  mr-4" />
                                                {manga.title.length > 40 ? `${manga.title.slice(0, 25)}...` : manga.title}
                                            </h1>
                                        </div>
                                        <p className="text-xs mt-14 text-gray-300 tracking-tight font-semibold line-clamp-[10] leading-relaxed">
                                            {manga.description || "No description available."}
                                        </p>
                                        <div className="absolute flex justify-center items-center inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent p-4">
                                            <button
                                                onClick={() => handleMangaClicked(manga)}
                                                className="mt-3 flex  w-full items-center -ml-1 gap-3 justify-center   p-2 rounded-lg border-2 border-[#4d229e] bg-[#4d229e]/40 shadow-md text-white text-sm font-medium transition-all duration-300 hover:bg-[#4d229e]/60 hover:scale-[101%]"
                                            >
                                                <Image className="brightness-200 mt-0.5" src="/list.svg" alt="list" width={20} height={20} />
                                                Read Now
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    ))}
                </div>
                <span
                    onClick={() => handleNext()}
                    className={`relative cursor-pointer brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 flex justify-center items-center p-7 rounded-xl overflow-hidden
                                      before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100
                                    `}
                    style={{
                        background: "linear-gradient(#3b235a, #24143f)",
                    }}
                >
                    <Image className=" brightness-200" src="/next.svg" alt="next" width={20} height={20} />
                </span>
            </section>
        </div>
    );
};

export default SliderComponent;
