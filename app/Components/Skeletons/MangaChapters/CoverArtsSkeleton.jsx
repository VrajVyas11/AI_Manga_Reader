
function CoverArtsSkeleton(isDark=true) {
  return (
    <div className={`grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`aspect-[3/4]  ${isDark?"bg-zinc-700/60":"bg-zinc-400/60"} animate-pulse rounded-2xl`} >
                </div>
          ))}
        </div>
  )
}

export default CoverArtsSkeleton