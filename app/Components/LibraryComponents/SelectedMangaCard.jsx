import Image from 'next/image';
import {
    Star,
    UserPlus,
    Pin,
} from 'lucide-react';


export const SelectedMangaCard = ({ selectedManga })=> {
    return (
        <div className="w-full mb-3 md:mb-0 border-l-[1px] border-white/5 p-4 py-0 shadow-xl">
            <div className="flex items-center mt-4 gap-3 mb-5">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                    <Pin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-100">Currently Selected</h2>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Your Last visited Manga</p>
                </div>
            </div>
            <div
                tabIndex={0}
                className="group  flex items-center md:gap-1 cursor-pointer rounded-lg   transition-colors duration-250 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 "
            >

                {/* Cover */}
                <div className="flex-shrink-0 mb-6  w-10 h-12 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md">
                    <Image
                        width={48}
                        height={64}
                        src={selectedManga.coverImageUrl || '/placeholder.jpg'}
                        alt={`Cover for ${selectedManga.title || 'unknown manga'}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[102%]"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                </div>

                {/* Title & Stats */}
                <div className="flex flex-col ml-1 md:ml-3 flex-1 min-w-0">
                    <h3
                        className="text-gray-100 text-xs md:text-base font-semibold truncate"
                        title={selectedManga.title}
                    >
                        {selectedManga.title || 'Untitled Manga'}
                    </h3>
                    <div className='flex flex-row w-full gap-4 mb-6'>
                        <div className="flex items-center gap-1 md:gap-1 mt-1 text-xs text-gray-400">
                            <span
                                className="flex items-center justify-center w-5 h-5 rounded-full  text-indigo-400"
                            >
                                <Star className="w-4 h-4" />
                            </span>
                            <span className="font-medium text-gray-300">{selectedManga?.rating?.rating?.bayesian.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-1 mt-1 text-xs text-gray-400">
                            <span
                                className="flex items-center justify-center w-5 h-5 rounded-full  text-indigo-400"
                            >
                                <UserPlus className="w-4 h-4" />
                            </span>
                            <span className="font-medium text-gray-300">{selectedManga?.rating?.follows}</span>
                        </div>
                    </div>
                    {/* <div className=' flex gap-1 w-full line-clamp-1'>
                      {selectedManga.flatTags.slice(0, 4).map((tag) => (
                        <div key={tag} className="flex px-2 py-1 min-w-fit items-center w-fit gap-1 md:gap-1 text-[10px] rounded-lg bg-gray-600/20 text-gray-400">
                          <span className="font-medium text-gray-300">{tag}</span>
                        </div>
                      ))}
                    </div> */}
                </div>
            </div>
        </div>
    )
}


export const MobileSelectedManga = ({selectedManga})=>{
    return ( <div className="w-full bg-black/30 md:hidden mb-3  rounded-xl border-[1px] border-white/10 p-4 py-0 shadow-xl">
                <div className="flex items-center mt-3 gap-3 mb-3">
                  <div className="bg-gray-800/50 p-2 rounded-lg">
                    <Pin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-100">Currently Selected</h2>
                    <p className="text-[7px] text-gray-400 uppercase tracking-wide">Your Last visited Manga</p>
                  </div>
                </div>
                <div
                  tabIndex={0}
                  className="group mb-3  flex items-center md:gap-1 cursor-pointer rounded-lg   transition-colors duration-250 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 "
                >
    
                  {/* Cover */}
                  <div className="flex-shrink-0   w-12 h-12  rounded-full overflow-hidden shadow-md">
                    <Image
                      width={48}
                      height={64}
                      src={selectedManga.coverImageUrl || '/placeholder.jpg'}
                      alt={`Cover for ${selectedManga.title || 'unknown manga'}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[102%]"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                  </div>
    
                  {/* Title & Stats */}
                  <div className="flex flex-col ml-1 md:ml-3 flex-1 min-w-0">
                    <h3
                      className="text-gray-100 text-xs md:text-base font-semibold truncate"
                      title={selectedManga.title}
                    >
                      {selectedManga.title || 'Untitled Manga'}
                    </h3>
                    <div className='flex flex-row w-full gap-4'>
                      <div className="flex items-center gap-1 md:gap-1 mt-1 text-xs text-gray-400">
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full  text-indigo-400"
                        >
                          <Star className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-gray-300">{selectedManga?.rating?.rating?.bayesian.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1 mt-1 text-xs text-gray-400">
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full  text-indigo-400"
                        >
                          <UserPlus className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-gray-300">{selectedManga?.rating?.follows}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)
}