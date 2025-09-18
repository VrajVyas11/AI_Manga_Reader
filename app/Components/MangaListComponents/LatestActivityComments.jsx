/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Clock,
    ExternalLink,
    RefreshCw,
    MessageCircle,
    Activity,
    Zap,
    BookOpen,
    ChevronUp,
    ChevronDown,
    Laugh,
    CircleX,
    ThumbsUp,
    Heart,
    CircleFadingArrowUp,
    Sparkles,
    TrendingUp,
    CornerDownRight,
} from "lucide-react";
import LatestActivityCommentsSkeleton from "../Skeletons/MangaList/LatestActivityCommentsSkeleton";
import { useTheme } from "../../providers/ThemeContext";

const CACHE_KEY = "mangadex_latest_comments";
const LAST_FETCH_TIMESTAMP_KEY = "mangadx_latest_comments_last_fetch";
const CACHE_DURATION_MS = 30 * 60 * 1000;

const LatestComments = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState(null);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showMore, setShowMore] = useState({});
    const [visible, setVisible] = useState(true);

    const fetchComments = useCallback(
        async (force = false) => {
            setLoading(true);
            setError(null);

            const now = Date.now();
            const cachedTimestamp = lastFetchTimestamp ?? 0;

            if (!force && now - cachedTimestamp < CACHE_DURATION_MS) {
                try {
                    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
                    if (cachedData.data) {
                        setComments(cachedData.data);
                        setLastUpdatedDisplay(new Date(cachedTimestamp).toLocaleTimeString());
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing cached data:", e);
                }
            }

            try {
                const response = await fetch("/api/comments/latestActivity");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error ?? "Failed to fetch comments");
                }

                const fetchedComments = data.data ?? [];
                setComments(fetchedComments);

                const newTimestamp = Date.now();
                setLastUpdatedDisplay(new Date(newTimestamp).toLocaleTimeString());
                setLastFetchTimestamp(newTimestamp);

                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({ data: fetchedComments, timestamp: newTimestamp })
                );
                localStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, newTimestamp.toString());
            } catch (err) {
                setError(err.message);
                console.error("Error fetching comments:", err);

                try {
                    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
                    if (cachedData.data) {
                        setComments(cachedData.data);
                        setLastUpdatedDisplay(
                            new Date(parseInt(localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY) ?? "0")).toLocaleTimeString()
                        );
                    }
                } catch (e) {
                    console.error("Error loading fallback cache:", e);
                }
            } finally {
                setLoading(false);
            }
        },
        [lastFetchTimestamp]
    );

    useEffect(() => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
        const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : null;

        if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_DURATION_MS) {
            try {
                const parsedData = JSON.parse(cachedData);
                setComments(parsedData.data ?? []);
                setLastUpdatedDisplay(new Date(cachedTimestamp).toLocaleTimeString());
                setLastFetchTimestamp(cachedTimestamp);
                setLoading(false);
            } catch {
                fetchComments();
            }
        } else {
            fetchComments();
        }
    }, [fetchComments]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const cachedTimestampStr = localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
            const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : 0;

            if (now - cachedTimestamp >= CACHE_DURATION_MS) {
                fetchComments();
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchComments]);

    const scrollContainerRef = React.useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.userSelect = "none";
            scrollContainerRef.current.style.cursor = "grabbing";
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.userSelect = "auto";
            scrollContainerRef.current.style.cursor = "grab";
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.userSelect = "auto";
            scrollContainerRef.current.style.cursor = "grab";
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX) * 2;
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const onWheel = (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, []);

    const truncateTitle = (title, maxLength = 25) => {
        if (!title) return "Unknown";
        return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
    };

    const getReactionIcon = (type) => {
        switch (type) {
            case "Funny":
                return <Laugh className={`w-5 h-5 ${isDark ? "text-yellow-400 fill-yellow-400/20" : "text-yellow-600 fill-yellow-600/20"}`} />;
            case "Strike":
                return <CircleX className={`w-5 h-5 ${isDark ? "text-red-400 fill-red-400/20" : "text-red-600 fill-red-600/20"}`} />;
            case "Like":
                return <ThumbsUp className={`w-5 h-5 -mt-2 ${isDark ? "text-blue-400 fill-blue-400/20" : "text-blue-600 fill-blue-600/20"}`} />;
            case "Love":
                return <Heart className={`w-5 h-5 ${isDark ? "text-pink-400 fill-current" : "text-pink-600 fill-current"}`} />;
            case "Replied":
                return <MessageCircle className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />;
            default:
                return <CircleFadingArrowUp className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />;
        }
    };

    const getActionText = (reactionType) => {
        switch (reactionType) {
            case 'Like':
            case 'Love':
            case 'Funny':
            case 'Strike':
                return 'reacted to';
            case 'Replied':
                return 'replied to';
            case 'Posted Thread':
                return 'created';
            case 'Reacted':
                return 'reacted to';
            default:
                return 'interacted with';
        }
    };

    if (!visible) {
        return (
            <div className="p-6 max-w-[95%] mb-2 flex justify-end items-center mx-auto">
                <hr className={`w-full border-[1px] ${isDark ? "border-white/20" : "border-gray-300/50"}`} />
                <button
                    onClick={() => setVisible((prev) => !prev)}
                    className={`px-5 py-3 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] ${isDark ? "bg-black/30 border-white/20 text-gray-300" : "bg-gray-100/50 border-gray-300/50 text-gray-700"} rounded-xl font-semibold shadow-lg transition-transform duration-0`}
                    aria-label="Toggle comments visibility"
                    title="Show Comments"
                >
                    <div className={`w-8 h-4 rounded-full relative transition-colors duration-0 ${isDark ? "bg-gray-600" : "bg-gray-400"}`}>
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0 transition-transform duration-0 translate-x-0.5" />
                    </div>
                    <span>Show Comments</span>
                </button>
            </div>
        );
    }
    if (loading && comments.length == 0) {
        return (
            <LatestActivityCommentsSkeleton isDark={isDark} />
        );
    }

    return (
        <div className="max-h-screen w-full relative overflow-hidden">
            <div className="relative p-6 w-full">
                <div className="max-w-[95%] mx-auto">
                    <div className="flex mb-7 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`relative ${isDark ? "bg-white/10" : "bg-gray-200/50"} p-3 rounded-lg`}>
                                <MessageCircle className={`w-7 h-7 ${isDark ? "text-sky-300" : "text-sky-600"} drop-shadow-md`} />
                                <div className={`absolute -top-2 -right-2 w-5 h-5 ${isDark ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-gradient prominant-to-r from-yellow-600 to-orange-600"} rounded-full border-2 ${isDark ? "border-gray-950" : "border-gray-300"} flex items-center justify-center animate-pulse`}>
                                    <Zap className={`w-3 h-3 ${isDark ? "text-white fill-white" : "text-gray-900 fill-gray-900"}`} />
                                </div>
                            </div>
                            <div>
                                <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"} uppercase tracking-wide`}>
                                    LATEST COMMUNITY ACTIVITY
                                </h2>
                                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide flex flex-row w-full`}>
                                    <Activity className={`w-4 h-4 mr-2 ${isDark ? "text-yellow-300" : "text-yellow-600"}`} />
                                    Real-time community interactions
                                    {lastUpdatedDisplay && (
                                        <span>
                                            (Last Updated At : {lastUpdatedDisplay})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => fetchComments(true)}
                                className={`px-5 py-3.5 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] ${isDark ? "bg-black/30 border-white/20 text-gray-300 hover:bg-black/40 hover:border-purple-400/40" : "bg-gray-100/50 border-gray-300/50 text-gray-700 hover:bg-gray-200/50 hover:border-purple-600/40"} rounded-xl font-semibold shadow-lg transition-transform duration-0`}
                                disabled={loading}
                                aria-label="Refresh comments"
                            >
                                {loading ? (
                                    <div className={`w-5 h-5 border-2 ${isDark ? "border-white/30 border-t-white" : "border-gray-300/50 border-t-gray-700"} rounded-full animate-spin mr-2`}></div>
                                ) : (
                                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                )}
                            </button>
                            <button
                                onClick={() => setVisible((prev) => !prev)}
                                className={`px-5 py-3 min-w-fit gap-2 flex flex-row justify-start items-center border-[1px] ${isDark ? "bg-black/30 border-white/20 text-gray-300 hover:bg-black/40" : "bg-gray-100/50 border-gray-300/50 text-gray-700 hover:bg-gray-200/50"} rounded-xl font-semibold shadow-lg transition-transform duration-0`}
                                aria-label="Toggle comments visibility"
                                title="Hide Comments"
                            >
                                <div className={`w-8 h-4 rounded-full relative transition-colors duration-0 ${isDark ? "bg-purple-600/70" : "bg-purple-400/70"}`}>
                                    <div className="w-4 h-4 bg-white rounded-full absolute top-0 transition-transform duration-0 translate-x-4" />
                                </div>
                                <span>Hide Comments</span>
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="mb-6">
                            <div className="relative group">
                                <div className={`absolute -inset-1 ${isDark ? "bg-gradient-to-r from-red-600/50 to-purple-600/50" : "bg-gradient-to-r from-red-400/50 to-purple-400/50"} rounded-2xl blur opacity-70`}></div>
                                <div className={`relative ${isDark ? "bg-gradient-to-r from-red-900/30 to-purple-900/30 border-red-500/30" : "bg-gradient-to-r from-red-200/30 to-purple-200/30 border-red-400/30"} rounded-xl p-4 backdrop-blur-sm`}>
                                    <div className={`flex items-center ${isDark ? "text-red-300" : "text-red-600"} font-medium`}>
                                        <span className="mr-3 text-xl select-none">⚡</span>
                                        Connection failed: {error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {comments.length > 0 ? (
                        <div className="relative">
                            <div
                                id="comments-container"
                                ref={scrollContainerRef}
                                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 cursor-grpreviously-grab active:cursor-grabbing"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    WebkitOverflowScrolling: "touch",
                                    scrollbarColor: isDark ? "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)" : "rgba(139, 92, 246, 0.6) rgba(0, 0, 0, 0.1)",
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                {comments.map((comment, index) => (
                                    <div
                                        key={comment.id ?? index}
                                        className="flex-shrink-0 w-80 relative group"
                                    >
                                        <div className={`relative ${showMore[comment.id] ? "h-auto" : "h-[295px]"} ${isDark ? "bg-gray-800/10 border-purple-500/20 hover:border-purple-500/40" : "bg-gray-100/50 border-purple-400/20 hover:border-purple-400/40"} mt-1 backdrop-blur-2xl overflow-hidden border rounded-[50px] p-5 pb-0 transition-all duration-0 shadow-xl`}>
                                            <div className="flex items-start space-x-4 mb-4">
                                                <div className="relative">
                                                    <div className={`absolute -inset-1 ${isDark ? "bg-gradient-to-r from-purple-500/80 to-cyan-500/80" : "bg-gradient-to-r from-purple-400/80 to-cyan-400/80"} rounded-full blur opacity-40`}></div>
                                                    <img
                                                        src={comment.avatarUrl}
                                                        alt={`${comment.username}'s avatar`}
                                                        className={`relative min-w-14 w-14 h-14 rounded-full border-2 ${isDark ? "border-purple-500/30 group-hover:border-purple-400/60" : "border-purple-400/30 group-hover:border-purple-600/60"} transition-all duration-0 object-cover shadow-lg`}
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=8b5cf6&color=fff`;
                                                        }}
                                                    />
                                                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${isDark ? "bg-green-500 border-slate-900" : "bg-green-600 border-gray-300"} border-3 rounded-full shadow-lg`}>
                                                        <div className={`w-full h-full ${isDark ? "bg-green-400" : "bg-green-500"} rounded-full animate-ping opacity-75`}></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 w-2/3">
                                                    <h3 className={`font-bold text-lg line-clamp-1 break-words flex-wrap text-ellipsis ${isDark ? "text-white" : "text-gray-900"}`}>
                                                        {comment.username}
                                                    </h3>
                                                    <div className={`flex items-center justify-between w-full space-x-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"} mt-1`}>
                                                        <span className="flex flex-row items-center justify-start gap-2">
                                                            <Clock className={`w-4 h-4 -mt-0.5 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                                                            {comment.timeAgo}
                                                        </span>
                                                        <div className={`w-1 h-1 ${isDark ? "bg-slate-500/30" : "bg-slate-400/30"} rounded-full`}></div>
                                                        <div className={`w-1 h-1 ${isDark ? "bg-slate-500/50" : "bg-slate-400/50"} rounded-full`}></div>
                                                        <div className={`w-1 h-1 ${isDark ? "bg-slate-500/70" : "bg-slate-400/70"} rounded-full`}></div>
                                                        <span className="text-xs">
                                                            {getReactionIcon(comment.reactionType)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex items-center space-x-2 text-sm flex-wrap gap-2">
                                                    <span className={`flex flex-row justify-start items-center ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                        <CornerDownRight strokeWidth={3} className={`w-4 h-4 mx-2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                                                        {getActionText(comment.reactionType)}
                                                        {comment.repliedTO && (
                                                            <a
                                                                href={`https://forums.mangadex.org${comment.postUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`ml-1 ${isDark ? "text-cyan-400 hover:text-cyan-300 decoration-cyan-500/30 hover:decoration-cyan-400/60" : "text-cyan-600 hover:text-cyan-500 decoration-cyan-400/30 hover:decoration-cyan-500/60"} transition-colors duration-0 underline line-clamp-1`}
                                                            >
                                                                {comment.repliedTO}
                                                            </a>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {comment.commentContent && (
                                                <div className="mb-1">
                                                    <div className="relative">
                                                        <div className={`absolute inset-0 ${isDark ? "" : "bg-gray-200/20"} rounded-xl blur-sm`}></div>
                                                        <div className={`relative rounded-[40px] p-6 py-5 border ${isDark ? "border-yellow-500/10" : "border-yellow-400/10"} shadow-inner`}>
                                                            <p className={`text-[14px] leading-relaxed line-clamp-4 ${isDark ? "text-white/90" : "text-gray-900/90"}`}>
                                                                {`" ${comment.commentContent}"`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setShowMore((prev) => {
                                                        return { ...prev, [comment.id]: !prev[comment.id] };
                                                    })
                                                }
                                                className={`w-full ${showMore[comment.id] ? "mb-1 relative" : "mb-1 absolute bottom-0 -ml-5"} flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} rounded-lg transition-all duration-200`}
                                            >
                                                {showMore[comment.id] ? (
                                                    <>
                                                        <ChevronUp className="w-3.5 h-3.5" />
                                                        <span>Show less Info</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                        <span>Show more Info</span>
                                                    </>
                                                )}
                                            </button>
                                            {showMore[comment.id] && (
                                                <div>
                                                    <div className={`relative rounded-xl p-5 border ${isDark ? "border-yellow-500/10" : "border-yellow-400/10"} shadow-inner`}>
                                                        <div className={`flex items-center ${(comment.chapterNo || comment.volumeNo) ? "mb-2" : "mb-0"} space-x-3`}>
                                                            <BookOpen className={`w-4 h-4 ${isDark ? "text-white-500 drop-shadow-[0_0_2px_rgba(255,204,0,0.7)]" : "text-gray-900 drop-shadow-[0_0_2px_rgba(202,138,4,0.7)]"}`} />
                                                            <h3
                                                                className={`text-xs truncate max-w-[calc(100%-3rem)] select-text ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                                                                title={comment.mangaTitle}
                                                            >
                                                                {truncateTitle(comment.mangaTitle, 30)}
                                                            </h3>
                                                        </div>
                                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                                            <div className={`flex flex-row w-full space-x-6 text-[10px] ${isDark ? "text-purple-300" : "text-purple-600"} font-semibold tracking-wide min-w-[140px]`}>
                                                                {comment.volumeNo && (
                                                                    <div className="flex justify-start flex-row w-1/2 gap-1 items-center">
                                                                        <span className={`uppercase ${isDark ? "text-purple-400" : "text-purple-500"} select-none`}>Volume :</span>
                                                                        <span className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>{comment.volumeNo}</span>
                                                                    </div>
                                                                )}
                                                                {comment.chapterNo && (
                                                                    <div className="flex flex-row w-1/2 gap-1 items-center">
                                                                        <span className={`uppercase ${isDark ? "text-purple-400" : "text-purple-500"} select-none`}>Chapter :</span>
                                                                        <span className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>{comment.chapterNo}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {(comment.chapterTitle || comment.chapterNo) && (
                                                                <p
                                                                    className={`text-xs flex flex-row gap-1 max-w-[60%] select-text ${isDark ? "text-purple-300/90" : "text-purple-600/90"}`}
                                                                    title={comment.chapterTitle ?? `Chapter ${comment.chapterNo}`}
                                                                >
                                                                    <span className={`uppercase font-semibold ${isDark ? "text-purple-400" : "text-purple-500"} select-none mr-2 text-[10px]`}>
                                                                        Title:
                                                                    </span>
                                                                    {`"`}
                                                                    <span className="w-full flex justify-start items-center whitespace-nowrap italic">
                                                                        {truncateTitle(comment.chapterTitle ?? `Chapter ${comment.chapterNo}`, 20)}
                                                                    </span>
                                                                    {`"`}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="h-14" />
                                                    <div className={`absolute bottom-0 left-0 right-0 p-4 ${isDark ? "bg-gradient-to-t from-gray-900/80 to-transparent" : "bg-gradient-to-t from-gray-200/80 to-transparent"} rounded-b-2xl`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`flex items-center space-x-1 text-[14px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                                                    <TrendingUp className={`w-4 h-4 ml-2 ${isDark ? "text-green-400" : "text-green-600"}`} />
                                                                    <span>Activity</span>
                                                                </div>
                                                                <div className={`w-1 h-1 ${isDark ? "bg-gray-600" : "bg-gray-400"} rounded-full`}></div>
                                                                <span className={`text-[14px] ${isDark ? "text-gray-500" : "text-gray-600"}`}>#{index + 1}</span>
                                                            </div>
                                                            <a
                                                                href={`https://forums.mangadx.org${comment.postUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`group/link flex items-center space-x-1 px-3 py-1.5 ${isDark ? "bg-purple-600/20 hover:bg-purple-600/40 border-purple-500/30 hover:border-purple-400/60" : "bg-purple-400/20 hover:bg-purple-400/40 border-purple-400/30 hover:border-purple-600/60"} border rounded-lg transition-all duration-0 hover:scale-105`}
                                                                aria-label="View full post"
                                                            >
                                                                <span className={`text-xs font-medium ${isDark ? "text-purple-300 group-hover/link:text-purple-200" : "text-purple-600 group-hover/link:text-purple-500"}`}>View Post</span>
                                                                <ExternalLink className={`w-3 h-3 ${isDark ? "text-purple-400 group-hover/link:text-purple-300" : "text-purple-600 group-hover/link:text-purple-500"} group-hover/link:rotate-12 transition-transform duration-0`} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-16">
                                <div className="relative group">
                                    <div className={`absolute -inset-1 ${isDark ? "bg-gradient-to-r from-purple-600/30 to-yellow-600/30" : "bg-gradient-to-r from-purple-400/30 to-yellow-400/30"} rounded-2xl blur opacity-50`}></div>
                                    <div className={`relative ${isDark ? "bg-gray-800/20 border-purple-500/20" : "bg-gray-100/20 border-purple-400/20"} backdrop-blur-sm rounded-2xl p-8 border`}>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                <MessageCircle className={`w-16 h-16 ${isDark ? "text-purple-400/50" : "text-purple-600/50"}`} />
                                                <div className={`absolute -top-2 -right-2 w-6 h-6 ${isDark ? "bg-yellow-500/80" : "bg-yellow-400/80"} rounded-full flex items-center justify-center`}>
                                                    <Sparkles className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-900"}`} />
                                                </div>
                                            </div>
                                            <h3 className={`text-xl font-bold ${isDark ? "text-white/80" : "text-gray-900/80"}`}>No Recent Activity</h3>
                                            <p className={`text-sm max-w-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                                The community seems quiet right now. Check back later for the latest discussions and reactions!
                                            </p>
                                            <button
                                                onClick={() => fetchComments(true)}
                                                className={`mt-4 px-6 py-2 ${isDark ? "bg-purple-600/30 hover:bg-purple-600/50 border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:text-purple-200" : "bg-purple-400/30 hover:bg-purple-400/50 border-purple-400/30 hover:border-purple-600/60 text-purple-600 hover:text-purple-500"} rounded-xl transition-all duration-0 text-sm font-medium`}
                                            >
                                                Refresh Activity
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default LatestComments;