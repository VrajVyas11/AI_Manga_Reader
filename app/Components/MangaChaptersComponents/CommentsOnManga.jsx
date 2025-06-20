import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageCircle,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  User2,
  Heart,
  ArrowUpCircle,
  MessageSquare,
  ChevronUp,
  Loader2,
  Users,
  Calendar,
  Flame,
  Star,
  CircleFadingArrowUp,
} from "lucide-react";

const CommentsOnManga = ({ manga }) => {
  const CACHE_KEY = `comments_on_manga_${manga?.id || "unknown"}`;
  const LAST_FETCH_TIMESTAMP_KEY = `comments_on_manga_${manga?.id || "unknown"}_last_fetch`;
  const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  const COMMENTS_PER_PAGE = 20;

  const thread = useMemo(() => manga?.rating?.comments?.threadId || null);
  const repliesCount = useMemo(() => manga?.rating?.comments?.repliesCount || 0);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState({});
  const [expandedSpoilers, setExpandedSpoilers] = useState({});

  useEffect(() => {
    if (repliesCount > 0) {
      setTotalPages(Math.ceil(repliesCount / COMMENTS_PER_PAGE));
    }
  }, [repliesCount]);

  const fetchComments = useCallback(
    async (page = 1) => {
      if (!thread || !repliesCount) {
        console.warn("No thread or repliesCount, skipping fetch");
        return;
      }

      const isFirstPage = page === 1;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const now = Date.now();
      const cacheKey = `${CACHE_KEY}_page_${page}`;
      const timestampKey = `${LAST_FETCH_TIMESTAMP_KEY}_page_${page}`;
      const cachedTimestamp = Number(localStorage.getItem(timestampKey)) || 0;

      if (now - cachedTimestamp < CACHE_DURATION_MS) {
        try {
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (parsedData?.data && parsedData?.total) {
              if (isFirstPage) {
                setComments(parsedData.data);
              } else {
                setComments((prev) => [...prev, ...parsedData.data]);
              }
              setTotal(parsedData.total);
              setLoading(false);
              setLoadingMore(false);
              console.log(`Loaded page ${page} comments from cache`);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing cached comments:", e);
        }
      }

      const skip = (page - 1) * COMMENTS_PER_PAGE;
      const adjustedRepliesCount = Math.max(0, repliesCount - skip);

      try {
        const url = new URL("/api/comments", window.location.origin);
        url.searchParams.append("thread", thread);
        url.searchParams.append("repliesCount", adjustedRepliesCount.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", COMMENTS_PER_PAGE.toString());

        const response = await fetch(url);
        const responseData = await response.json();

        const { data, total, error: apiError } = responseData;
        if (apiError) {
          setError(apiError);
        } else {
          if (isFirstPage) {
            setComments(data || []);
          } else {
            setComments((prev) => [...prev, ...(data || [])]);
          }
          setTotal(total || 0);
          const newTimestamp = Date.now();

          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data, total, timestamp: newTimestamp })
            );
            localStorage.setItem(timestampKey, newTimestamp.toString());
            console.log(`Cached page ${page} comments successfully`);
          } catch (e) {
            console.error("Error saving to localStorage:", e);
          }
        }
      } catch (err) {
        setError("Failed to load comments: " + err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [thread, repliesCount, CACHE_KEY, LAST_FETCH_TIMESTAMP_KEY]
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const loadMoreComments = () => {
    if (currentPage < totalPages && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchComments(nextPage);
    }
  };

  const parseCommentContent = (content) => {
    if (!content) return { parts: [] };

    const parts = [];
    const lines = content
      .split("\n")
      .map((line) => line.replace(/\t/g, ""))
      .filter((line) => line !== "");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.endsWith("said:")) {
        parts.push({
          type: "reaction",
          content: line.trim(),
        });
      } else if (line === "Click to expand...") {
        parts.push({
          type: "expandable",
          content: [lines[i - 1]].join("\n").trim(),
        });
      } else if (line.startsWith("Spoiler:")) {
        const spoilerTitle = line.replace("Spoiler:", "").trim() || "Spoiler";
        const spoilerContent = lines.slice(i + 1).join("\n").trim();
        parts.push({
          type: "spoiler",
          title: spoilerTitle,
          content: spoilerContent,
        });
        break;
      } else {
        if (lines[i + 1] === "Click to expand...") continue;
        parts.push({
          type: "normal",
          content: line,
        });
      }
    }

    return { parts };
  };

  const toggleExpandText = (key) => {
    setExpandedTexts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSpoiler = (key) => {
    setExpandedSpoilers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-8">
        {/* Animated Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-20 h-4 sm:w-32 sm:h-6 bg-gray-700 rounded-md animate-pulse"></div>
                <div className="w-16 h-2 sm:w-24 sm:h-3 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-12 h-6 sm:w-16 sm:h-8 bg-gray-700 rounded-full animate-pulse"></div>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-700 rounded-full animate-spin border-t-gray-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Comments container */}
      <div className="pb-4  sm:pb-6 rounded-3xl" aria-label="Comments container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-lg flex items-center justify-center shadow-md shadow-black/50">
                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-100">COMMUNITY</h1>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-white text-xs uppercase tracking-wider">
                <Flame className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                <span className="text-[10px] sm:text-xs">Join the discussion</span>
              </div>
            </div>
          </div>

          <div className="flex items-center w-fit flex-col md:flex-row space-x-1 space-y-1 md:space-y-0 sm:space-x-3 text-gray-300 text-xs sm:text-sm">
            {total > 0 && (
              <div className="flex items-center w-full space-x-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg">
                <Users className="w-3 h-3 sm:w-5 sm:h-5 text-purple-300" />
                <span className="font-semibold">{total.toLocaleString()}</span>
                <span className="text-white hidden md:block text-[11px] sm:text-xs">voices</span>
              </div>
            )}

            {totalPages > 1 && (
              <div className="hidden md:flex items-center  w-full space-x-2 px-3 py-0.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg">
                {/* <BookOpenText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" /> */}
                <span className="font-semibold ">Page </span>
                <span className="font-semibold">{currentPage}</span>
                <span className="text-white">/</span>
                <span className="text-white">{totalPages}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-rose-900 border border-rose-700 rounded-2xl text-xs sm:text-sm text-rose-400">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-rose-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Error Loading Comments</h3>
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {comments.length === 0 && !loading ? (
          <div className="text-center py-12 sm:py-16 text-white">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-800 rounded-2xl flex items-center justify-center shadow-md">
                <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2 sm:mb-3">Start the Conversation</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">Be the first to share your thoughts about this manga!</p>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 sm:px-5 sm:py-2 bg-purple-700 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Join Discussion</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Comments Timeline */}
            <div
              // style={{scrollbarWidth:"none"}}
              className="space-y-4 max-h-[900px] overflow-y-auto
  [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:
 overflow-auto sm:space-y-6 pr-2">
              {comments.map((comment, index) => {
                const commentId = comment.id || index;
                const { parts } = parseCommentContent(comment.commentContent);

                return (
                  <article
                    key={commentId}
                    className="group relative bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20 transform hover:-translate-y-0.5"
                  >
                    <div className="flex absolute right-2 sm:right-3 top-2 sm:top-3 w-fit items-center space-x-1 sm:space-x-2">
                      {comment.reactionType && comment.reactionUsers !== "None" && (
                        <div className="flex items-center w-full space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-rose-800/10 border border-rose-700 rounded-xl hover:border-rose-600 transition-all duration-300 text-xs sm:text-sm">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600 fill-rose-500" />
                          <span className="text-white font-semibold w-full text-[10px] sm:text-xs">{comment.reactionUsers} Likes</span>
                        </div>
                      )}
                      {parts.map((part, partIndex) => {
                        const key = `${commentId}-${partIndex}`;

                        if (part.type === "reaction") {
                          return (
                            <div
                              key={key}
                              className="hidden md:flex w-full min-w-fit items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-800/10 border border-green-700 rounded-xl hover:border-green-600 transition-all duration-300 text-xs sm:text-sm"
                            >
                              <CircleFadingArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                              <span className="text-white font-semibold w-full text-[10px] sm:text-xs">{part.content.split(" ")[0]} Upvotes</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="absolute -bottom-2 sm:-bottom-3 right-2 sm:right-3">
                      {comment.postUrl && (
                        <a
                          href={comment.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 sm:p-2 text-white hover:text-purple-500 hover:bg-purple-900/30 rounded-xl transition-all duration-300 group"
                          aria-label="Open post in new tab"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                    <div className="p-4 sm:p-6 relative">
                      {/* User Profile Header */}
                      <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-5">
                        <div className="relative flex-shrink-0">
                          {comment.avatarUrl ? (
                            <img
                              src={comment.avatarUrl}
                              alt={`${comment.username || "Anonymous"} avatar`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-gray-700 transition-all duration-300 shadow-md"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-800 flex items-center justify-center border-2 border-gray-700 transition-all duration-300 shadow-md ${comment.avatarUrl ? "hidden" : "flex"
                              }`}
                          >
                            <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          {/* Online Indicator */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full border-2 border-gray-900 flex items-center justify-center animate-pulse"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-bold text-gray-100 transition-colors truncate">
                              {comment.username || "Anonymous"}
                            </h3>
                            {comment.userTitle && (
                              <span className="px-2 py-0.5 bg-purple-700/30 border border-purple-700 rounded-full text-[10px] sm:text-xs text-purple-400 font-medium">
                                {comment.userTitle}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs text-white">
                            {comment.timeAgo && (
                              <div className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                                <Clock className="w-3 h-3" />
                                <time dateTime={comment.postDateTime || undefined}>{comment.timeAgo}</time>
                              </div>
                            )}
                            {comment.joinedDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Member since {new Date(comment.joinedDate).getFullYear()}</span>
                              </div>
                            )}
                            {comment.messageCount && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{comment.messageCount.toLocaleString()} posts</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="space-y-3 sm:space-y-4 text-gray-300 leading-snug ml-12 sm:ml-16 text-xs sm:text-sm">
                        {parts.map((part, partIndex) => {
                          const key = `${commentId}-${partIndex}`;

                          if (part.type === "normal") {
                            return (
                              <p key={key} className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                {part.content}
                              </p>
                            );
                          }

                          if (part.type === "expandable") {
                            const isExpanded = expandedTexts[key];
                            return (
                              <div key={key} className="relative">
                                {!isExpanded ? (
                                  <div
                                    className="relative cursor-pointer group/expand rounded-xl overflow-hidden"
                                    onClick={() => toggleExpandText(key)}
                                  >
                                    <div className="blur-[2px] select-none p-3 sm:p-4">
                                      <p className="text-white text-xs sm:text-sm">{part.content}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-gray-900/90 group-hover/expand:bg-gray-900/80 transition-all duration-300 flex items-center justify-center">
                                      <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-800 flex items-center space-x-2 rounded-xl text-white font-semibold shadow-md transform group-hover/expand:scale-105 transition-all duration-300 text-xs sm:text-sm">
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Click to expand</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-gray-900 rounded-xl border border-gray-700">
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{part.content}</p>
                                    <button
                                      onClick={() => toggleExpandText(key)}
                                      className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors text-xs"
                                    >
                                      <EyeOff className="w-3 h-3" />
                                      <span>Collapse content</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          if (part.type === "spoiler") {
                            const isExpanded = expandedSpoilers[key];
                            return (
                              <div
                                key={key}
                                className="border border-yellow-700 rounded-xl bg-gray-900 overflow-hidden backdrop-blur-sm"
                              >
                                <button
                                  onClick={() => toggleSpoiler(key)}
                                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-yellow-900/30 transition-all duration-300 text-sm text-yellow-400"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-700 rounded-lg flex items-center justify-center text-xl">
                                      ⚠️
                                    </div>
                                    <div className="text-left">
                                      <span className="font-bold block text-xs sm:text-sm">Spoiler Alert</span>
                                      <span className="text-yellow-500 text-[10px] sm:text-xs">{part.title}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs px-3 py-1 bg-yellow-700 rounded-full font-medium">
                                      {isExpanded ? "Hide spoiler" : "Reveal spoiler"}
                                    </span>
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 transition-transform duration-300" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 transition-transform duration-300" />
                                    )}
                                  </div>
                                </button>
                                {isExpanded && (
                                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-yellow-700 bg-gray-900 animate-in slide-in-from-top-2 duration-300">
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                                      {part.content}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Section */}
            {currentPage < totalPages && (
              <div className="mt-8 sm:mt-12 text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-white/5 backdrop-blur-md border border-white/10 disabled:bg-gray-700 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-purple-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                  <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Loading more discussions...</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Load More Comments</span>
                        <div className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                          {totalPages - currentPage} more pages
                        </div>
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* End of Comments Indicator */}
            {currentPage >= totalPages && total > 0 && (
              <div className="mt-8 sm:mt-12 text-center">
                <div className="max-w-lg mx-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-2">
                    You've reached the end!
                  </h3>

                  <p className="text-green-400 mb-4 text-xs sm:text-sm">
                    You've seen all {total.toLocaleString()} comments in this discussion.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsOnManga;