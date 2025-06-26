import {
  BookOpen,
  Star,
  Clock,
  X,
  SortAsc,
  TrendingUp,
  ArrowUpDown,
  Tag,
  Filter,
  XCircle,
  ClockAlert,
  CircleCheck,
  ListFilter,
} from 'lucide-react';
import filterOptions from '../../constants/filterOptions';
// Desktop Filter Panel (preserved)
export const FilterPanel = ({ filters, onFiltersChange }) => {
    const options = {
        genres: filterOptions.genres,
        formats: filterOptions.formats,
        themes: filterOptions.themes,
        content: filterOptions.content,
    };

    const statusIconMap = {
        ongoing: Clock,
        completed: CircleCheck,
        hiatus: ClockAlert,
        cancelled: XCircle,
    };

    const statusOptions = [
        ...filterOptions.statuses.map((status) => ({
            value: status.id,
            label: status.label,
            icon: statusIconMap[status.id] || BookOpen,
            color: status.color,
        })),
    ];

    const sortOptions = [
        { value: 'recent', label: 'Recency', icon: Clock },
        { value: 'rating', label: 'Top Rated', icon: Star },
        { value: 'popular', label: 'Most Popular', icon: TrendingUp },
        { value: 'title', label: 'Title A-Z', icon: SortAsc },
        { value: 'progress', label: 'Progress', icon: ArrowUpDown },
    ];

    return (
        <div className="rounded-xl p-4 min-h-[75vh] max-h-[75vh] border-[1px] border-white/10 sticky top-6 text-sm">
            <div className="flex mb-5 gap-3 items-center justify-between">
                <div className="flex items-center gap-3 justify-between">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                        <Filter className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-100">Filter</h2>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wide">Filter Reading history</p>
                    </div>
                </div>
                <button
                    onClick={() => onFiltersChange({ genre: [], status: 'all', sort: 'recent' })}
                    className="w-fit p-4 bg-gray-950 hover:bg-red-900 text-gray-400 hover:text-red-400 rounded-lg transition-all flex items-center justify-center gap-1 border border-gray-900 hover:border-red-700 text-xs"
                >
                    <X className="w-4 h-4" />
                    Clear
                </button>
            </div>

            <div className="max-h-[75vh] px-2 custom-scrollbar overflow-y-auto">
                <div className=' max-h-[180px] flex flex-col gap-3 overflow-y-auto custom-scrollbar'>
                    {/* Genres Filter */}
                    <div className=" min-h-fit">
                        <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Genres
                        </h3>
                        <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                            {options.genres.map((genre) => (
                                <li
                                    key={genre.label}
                                    onClick={() => {
                                        const newGenres = filters.genre.includes(genre.label)
                                            ? filters.genre.filter((g) => g !== genre.label)
                                            : [...filters.genre, genre.label];
                                        onFiltersChange({ ...filters, genre: newGenres });
                                    }}
                                    className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(genre.label)
                                            ? ' border-purple-500/40 bg-gray-700/30'
                                            : ' border-gray-500/20 hover:bg-gray-700'
                                        }`}
                                    role="button"
                                    aria-pressed={filters.genre.includes(genre.label)}
                                >
                                    <div className="px-1 my-auto text-center">
                                        <span className="my-auto select-none text-xs relative bottom-[1px]">
                                            {genre.label}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>

                    {/* Formats Filter */}
                    <div className="min-h-fit">
                        <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Formats
                        </h3>
                        <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                            {options.formats.map((format) => (
                                <li
                                    key={format.label}
                                    onClick={() => {
                                        const newGenres = filters.genre.includes(format.label)
                                            ? filters.genre.filter((g) => g !== format.label)
                                            : [...filters.genre, format.label];
                                        onFiltersChange({ ...filters, genre: newGenres });
                                    }}
                                    className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(format.label)
                                            ? ' border-purple-500/40 bg-gray-700/30'
                                            : ' border-gray-500/20 hover:bg-gray-700'
                                        }`}
                                    role="button"
                                    aria-pressed={filters.genre.includes(format.label)}
                                >
                                    <div className="px-1 my-auto text-center">
                                        <span className="my-auto select-none text-xs relative bottom-[1px]">
                                            {format.label}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>

                    {/* Themes Filter */}
                    <div className="  min-h-fit">
                        <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Themes
                        </h3>
                        <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">
                            {options.themes.map((theme) => (
                                <li
                                    key={theme.label}
                                    onClick={() => {
                                        const newGenres = filters.genre.includes(theme.label)
                                            ? filters.genre.filter((g) => g !== theme.label)
                                            : [...filters.genre, theme.label];
                                        onFiltersChange({ ...filters, genre: newGenres });
                                    }}
                                    className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(theme.label)
                                            ? ' border-purple-500/40 bg-gray-700/30'
                                            : ' border-gray-500/20 hover:bg-gray-700'
                                        }`}
                                    role="button"
                                    aria-pressed={filters.genre.includes(theme.label)}
                                >
                                    <div className="px-1 my-auto text-center">
                                        <span className="my-auto select-none text-xs relative bottom-[1px]">
                                            {theme.label}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>

                    {/* Content Filter */}
                    <div className=" min-h-fit">
                        <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Content
                        </h3>
                        <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                            {options.content.map((content) => (
                                <li
                                    key={content.label}
                                    onClick={() => {
                                        const newGenres = filters.genre.includes(content.label)
                                            ? filters.genre.filter((g) => g !== content.label)
                                            : [...filters.genre, content.label];
                                        onFiltersChange({ ...filters, genre: newGenres });
                                    }}
                                    className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(content.label)
                                            ? ' border-purple-500/40 bg-gray-700/30'
                                            : ' border-gray-500/20 hover:bg-gray-700'
                                        }`}
                                    role="button"
                                    aria-pressed={filters.genre.includes(content.label)}
                                >
                                    <div className="px-1 my-auto text-center">
                                        <span className="my-auto select-none text-xs relative bottom-[1px]">
                                            {content.label}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="mb-4 mt-5">
                    <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Status
                    </h3>
                    <div className="gap-1 grid grid-cols-2 flex-row">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onFiltersChange({ ...filters, status: option.value })}
                                className={`w-full flex col-span-1 items-center gap-2 p-2 px-3 rounded-lg text-xs transition-all duration-300 ${filters.status === option.value
                                    ? 'bg-gray-900 text-gray-100 border border-gray-800 shadow-inner'
                                    : 'text-gray-400 hover:bg-gray-900 border border-gray-800 hover:text-gray-300'
                                    }`}
                                aria-pressed={filters.status === option.value}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Options */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                        <ListFilter className="w-5 h-5" />
                        Sort By
                    </h3>
                    <div className="gap-1 grid grid-cols-2 flex-row">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onFiltersChange({ ...filters, sort: option.value })}
                                className={`w-full flex col-span-1 items-center gap-2 p-2 px-3 rounded-lg text-xs transition-all duration-300 ${filters.sort === option.value
                                    ? 'bg-gray-900 text-gray-100 border border-gray-800 shadow-inner'
                                    : 'text-gray-400 hover:bg-gray-900 border border-gray-800 hover:text-gray-300'
                                    }`}
                                aria-pressed={filters.sort === option.value}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mobile Filter Panel (overlay)
export const MobileFilterPanel = ({ filters, onFiltersChange, isOpen, onClose }) => {
    const options = {
        genres: filterOptions.genres,
        formats: filterOptions.formats,
        themes: filterOptions.themes,
        content: filterOptions.content,
    };

    const statusIconMap = {
        ongoing: Clock,
        completed: CircleCheck,
        hiatus: ClockAlert,
        cancelled: XCircle,
    };

    const statusOptions = [
        ...filterOptions.statuses.map((status) => ({
            value: status.id,
            label: status.label,
            icon: statusIconMap[status.id] || BookOpen,
            color: status.color,
        })),
    ];

    const sortOptions = [
        { value: 'recent', label: 'Recency', icon: Clock },
        { value: 'rating', label: 'Top Rated', icon: Star },
        { value: 'popular', label: 'Most Popular', icon: TrendingUp },
        { value: 'title', label: 'Title A-Z', icon: SortAsc },
        { value: 'progress', label: 'Progress', icon: ArrowUpDown },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute right-0 top-14 h-full w-80 bg-gray-950 border-l border-gray-800 overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-800/50 p-2 rounded-lg">
                                <Filter className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-100">Filter</h2>
                                <p className="text-xs text-gray-400">Filter Reading history</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-300 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Genres Filter */}
                        <div className=' max-h-[140px] mb-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar'>
                            {/* Genres Filter */}
                            <div className=" min-h-fit">
                                <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Genres
                                </h3>
                                <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                                    {options.genres.map((genre) => (
                                        <li
                                            key={genre.label}
                                            onClick={() => {
                                                const newGenres = filters.genre.includes(genre.label)
                                                    ? filters.genre.filter((g) => g !== genre.label)
                                                    : [...filters.genre, genre.label];
                                                onFiltersChange({ ...filters, genre: newGenres });
                                            }}
                                            className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(genre.label)
                                                    ? ' border-purple-500/40 bg-gray-700/30'
                                                    : ' border-gray-500/20 hover:bg-gray-700'
                                                }`}
                                            role="button"
                                            aria-pressed={filters.genre.includes(genre.label)}
                                        >
                                            <div className="px-1 my-auto text-center">
                                                <span className="my-auto select-none text-xs relative bottom-[1px]">
                                                    {genre.label}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            </div>

                            {/* Formats Filter */}
                            <div className="min-h-fit">
                                <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Formats
                                </h3>
                                <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                                    {options.formats.map((format) => (
                                        <li
                                            key={format.label}
                                            onClick={() => {
                                                const newGenres = filters.genre.includes(format.label)
                                                    ? filters.genre.filter((g) => g !== format.label)
                                                    : [...filters.genre, format.label];
                                                onFiltersChange({ ...filters, genre: newGenres });
                                            }}
                                            className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(format.label)
                                                    ? ' border-purple-500/40 bg-gray-700/30'
                                                    : ' border-gray-500/20 hover:bg-gray-700'
                                                }`}
                                            role="button"
                                            aria-pressed={filters.genre.includes(format.label)}
                                        >
                                            <div className="px-1 my-auto text-center">
                                                <span className="my-auto select-none text-xs relative bottom-[1px]">
                                                    {format.label}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            </div>

                            {/* Themes Filter */}
                            <div className="  min-h-fit">
                                <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Themes
                                </h3>
                                <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">
                                    {options.themes.map((theme) => (
                                        <li
                                            key={theme.label}
                                            onClick={() => {
                                                const newGenres = filters.genre.includes(theme.label)
                                                    ? filters.genre.filter((g) => g !== theme.label)
                                                    : [...filters.genre, theme.label];
                                                onFiltersChange({ ...filters, genre: newGenres });
                                            }}
                                            className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(theme.label)
                                                    ? ' border-purple-500/40 bg-gray-700/30'
                                                    : ' border-gray-500/20 hover:bg-gray-700'
                                                }`}
                                            role="button"
                                            aria-pressed={filters.genre.includes(theme.label)}
                                        >
                                            <div className="px-1 my-auto text-center">
                                                <span className="my-auto select-none text-xs relative bottom-[1px]">
                                                    {theme.label}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            </div>

                            {/* Content Filter */}
                            <div className=" min-h-fit">
                                <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Content
                                </h3>
                                <div className="flex min-h-fit flex-wrap gap-1 max-h-28 overflow-visible ">

                                    {options.content.map((content) => (
                                        <li
                                            key={content.label}
                                            onClick={() => {
                                                const newGenres = filters.genre.includes(content.label)
                                                    ? filters.genre.filter((g) => g !== content.label)
                                                    : [...filters.genre, content.label];
                                                onFiltersChange({ ...filters, genre: newGenres });
                                            }}
                                            className={`transition-all  cursor-pointer border-solid border-[0.5px] rounded-md px-1 flex items-center gap-1 text-gray-300
              ${filters.genre.includes(content.label)
                                                    ? ' border-purple-500/40 bg-gray-700/30'
                                                    : ' border-gray-500/20 hover:bg-gray-700'
                                                }`}
                                            role="button"
                                            aria-pressed={filters.genre.includes(content.label)}
                                        >
                                            <div className="px-1 my-auto text-center">
                                                <span className="my-auto select-none text-xs relative bottom-[1px]">
                                                    {content.label}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Status
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => onFiltersChange({ ...filters, status: option.value })}
                                        className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${filters.status === option.value
                                            ? 'bg-gray-900 text-gray-100 border border-gray-800'
                                            : 'text-gray-400 hover:bg-gray-900 border border-gray-800 hover:text-gray-300'
                                            }`}
                                    >
                                        <option.icon className="w-4 h-4" />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                                <ListFilter className="w-4 h-4" />
                                Sort By
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => onFiltersChange({ ...filters, sort: option.value })}
                                        className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${filters.sort === option.value
                                            ? 'bg-gray-900 text-gray-100 border border-gray-800'
                                            : 'text-gray-400 hover:bg-gray-900 border border-gray-800 hover:text-gray-300'
                                            }`}
                                    >
                                        <option.icon className="w-4 h-4" />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                onFiltersChange({ genre: [], status: 'all', sort: 'recent' });
                                onClose();
                            }}
                            className="w-full p-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-all flex items-center justify-center gap-2 border border-red-900/30"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

