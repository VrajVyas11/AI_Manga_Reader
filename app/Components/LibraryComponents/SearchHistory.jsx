import { Search } from 'lucide-react'

function SearchHistory({searchHistory,handleSearchClick}) {
  return (
         <div className="h-fit rounded-xl flex-1 flex flex-col shadow-lg">
                <div className="flex mb-5 gap-3 mt-4 items-center justify-between">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <Search className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-100">Search History</h2>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wide">Your Search History</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-900/80 p-1 px-3 rounded-full border border-gray-800">
                    <div>{searchHistory.length}</div>
                  </div>
                </div>

                <div className="flex-1">
                  {searchHistory.length > 0 ? (
                    <div className="flex min-h-fit flex-wrap gap-1 max-h-44 overflow-y-scroll custom-scrollbar">
                      {searchHistory.slice(0, 10).map((query, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearchClick(query)}
                          className="w-fit flex items-center gap-2 p-2 px-3 bg-gray-950 hover:bg-gray-900 border border-gray-900 rounded-lg text-left transition-colors duration-200 text-xs text-gray-400 hover:text-gray-300"
                        >
                          <Search className="w-3 h-3" />
                          <span className="truncate flex-1">{query}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-400 text-xs">
                      <div className="p-3 bg-gray-900 rounded-full mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <p>No search history</p>
                      <p className="mt-1 text-gray-600 text-xs">Your searches will appear here</p>
                    </div>
                  )}
                </div>
              </div>
  )
}

export default SearchHistory