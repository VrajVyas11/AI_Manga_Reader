import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* --- Types --- */
type ToastType = "info" | "success" | "warning" | "error";

type ToastItem = {
  id: number;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms (0 = persist)
  details?: string | object | null;
};

/* --- Internal global state & listeners --- */
let internalToasts: ToastItem[] = [];
// eslint-disable-next-line no-unused-vars
const listenerSet: Set<(list: ToastItem[]) => void> = new Set();
let nextId = 1;

function notifyListeners() {
  const snapshot = internalToasts.slice();
  listenerSet.forEach((fn) => {
    try {
      fn(snapshot);
    } catch {
      // ignore listener errors
    }
  });
}

/* --- Public helpers --- */
export function showGlobalToast(input: Partial<ToastItem>) {
  const id = nextId++;
  const toast: ToastItem = {
    id,
    title: input.title,
    message: input.message || "",
    type: input.type || "info",
    duration: typeof input.duration === "number" ? input.duration : 6000,
    details: input.details || null,
  };

  // cap to 6 to avoid layout blowup
  internalToasts = [toast, ...internalToasts].slice(0, 6);
  notifyListeners();

  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      removeGlobalToast(id);
    }, toast.duration);
  }

  return id;
}

export function removeGlobalToast(id: number) {
  const beforeLen = internalToasts.length;
  internalToasts = internalToasts.filter((t) => t.id !== id);
  if (internalToasts.length !== beforeLen) notifyListeners();
}

/* --- Hook for components --- */
export function useToast() {
  // stable callbacks return same reference across renders
  const showToast = useCallback((props: Partial<ToastItem>) => showGlobalToast(props), []);
  const removeToast = useCallback((id: number) => removeGlobalToast(id), []);
  return { showToast, removeToast };
}

/* --- Portal component --- */
export default function ToastsPortal({ isDark = true }: { isDark?: boolean }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [detail, setDetail] = useState<ToastItem | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const listener = (list: ToastItem[]) => {
      if (mountedRef.current) setToasts(list);
    };
    listenerSet.add(listener);
    // initialize
    listener(internalToasts);

    return () => {
      mountedRef.current = false;
      listenerSet.delete(listener);
    };
  }, []);

  // dismiss handler stable
  const handleDismiss = useCallback((id: number) => {
    removeGlobalToast(id);
  }, []);

  // open details stable
  const openDetails = useCallback((t: ToastItem) => setDetail(t), []);
  const closeDetails = useCallback(() => setDetail(null), []);

  // Build toast nodes memoized by toasts (only re-compute when toasts change)
  const toastNodes = useMemo(() => {
    return toasts.map((t) => {
      const bgClass =
        t.type === "success"
          ? "bg-green-600"
          : t.type === "error"
          ? "bg-red-600"
          : t.type === "warning"
          ? "bg-yellow-400"
          : "bg-gray-700";
      const textClass = t.type === "warning" ? "text-black" : "text-white";

      // short preview for tiny screens
      const short =
        t.message.length > 120 ? t.message.slice(0, 117).trim() + "…" : t.message;

      return (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 p-3 rounded-lg shadow-lg ${bgClass} ${textClass} w-full max-w-[240px] sm:max-w-[420px] sm:min-w-[240px] break-words`}
        >
          <div className="flex-1">
            {t.title ? <div className="font-semibold text-xs sm:text-sm">{t.title}</div> : null}
            <div className=" text-[9px] sm:text-xs mt-1" title={t.message}>
              <span className="hidden sm:inline">{t.message}</span>
              <span className="inline sm:hidden">{short}</span>
            </div>

            {t.details ? (
              <button
                onClick={() => openDetails(t)}
                className="mt-2 text-xs underline opacity-90 bg-transparent border-0 p-0"
              >
                See details
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleDismiss(t.id)}
              aria-label="Dismiss"
              className="text-current opacity-95 hover:opacity-80 rounded-md px-2 py-1 bg-transparent border-0"
            >
              ✕
            </button>
          </div>
        </div>
      );
    });
  }, [toasts, handleDismiss, openDetails]);

  // responsive detection (small screens -> centered bottom)
  const [isMobile, setIsMobile] = useState<boolean>(() => (typeof window !== "undefined" ? window.innerWidth < 640 : false));
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Container: bottom-right on desktop, bottom-center on mobile */}
      <div
        aria-live="polite"
        className={`fixed z-[9999] ${isMobile ? "right-0  bottom-3 w-full  max-w-[440px]  items-end" : "right-4 bottom-6 items-end"} flex flex-col gap-2 px-2`}
        style={{ pointerEvents: "none" }}
      >
        {toastNodes}
      </div>

      {detail ? (
        <>
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-3xl rounded-lg overflow-hidden relative z-20 shadow-2xl ${isDark ? "bg-neutral-900 text-white" : "bg-white text-slate-900"}`}>
              <div className="flex justify-between items-center p-3 border-b" >
                <div className="font-semibold">{detail.title || "Details"}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      try {
                        const text = typeof detail.details === "string" ? detail.details : JSON.stringify(detail.details, null, 2);
                        navigator.clipboard?.writeText(text);
                      } catch {}
                    }}
                    className="text-sm px-3 py-1 rounded-md bg-transparent hover:bg-slate-200/10"
                  >
                    Copy
                  </button>

                  <button
                    onClick={closeDetails}
                    className="text-sm px-3 py-1 rounded-md bg-transparent hover:bg-slate-200/10"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-auto text-sm max-h-[70vh]">
                <pre className="whitespace-pre-wrap break-words m-0 text-xs">
                  {typeof detail.details === "string" ? detail.details : JSON.stringify(detail.details, null, 2)}
                </pre>

                <div className="mt-3 text-xs opacity-90">
                  This information is for troubleshooting. If it looks technical, copy it and share with support or refer to the message title for a short hint.
                </div>
              </div>
            </div>

            {/* overlay */}
            <div className="fixed inset-0 bg-black/40 z-10" onClick={closeDetails} />
          </div>
        </>
      ) : null}
    </>
  );
}