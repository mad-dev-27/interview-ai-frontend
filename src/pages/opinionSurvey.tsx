import React from "react";

/**
 * GoogleFormEmbed
 * A small, reusable React component to embed a Google Form responsively.
 *
 * Props:
 *  - src (string) : iframe src. Defaults to the provided form URL.
 *  - title (string) : iframe title for accessibility.
 *  - height (number|string) : iframe height in px (number) or CSS string (e.g. '80vh').
 *  - aspectRatio (string) : optional aspect ratio like '16/9' or '4/3'. When set, the iframe becomes responsive using that ratio.
 *  - className (string) : extra classes for outer wrapper.
 *  - showOpenButton (boolean) : show a small "Open in new tab" button under the iframe.
 *
 * Usage:
 *  <GoogleFormEmbed />
 *  <GoogleFormEmbed src="https://docs.google.com/forms/.." aspectRatio="4/3" />
 */

export default function GoogleFormEmbed({
  src = "https://docs.google.com/forms/d/e/1FAIpQLSeIEeJjK0B0t0SI2jXuY0RhXWIAiHTYjgDOB4Gv2Q-sB888YA/viewform?embedded=true",
  title = "Embedded Google Form",
  height = 2000,
  aspectRatio = undefined,
  className = "",
  showOpenButton = true,
}) {
  // If aspectRatio is provided (like '16/9' or '4/3'), convert to padding-top percentage
  const ratioStyle = React.useMemo(() => {
    if (!aspectRatio) return null;
    const parts = aspectRatio.split("/").map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) return null;
    const [w, h] = parts;
    const paddingTop = (h / w) * 100;
    return { paddingTop: `${paddingTop}%` };
  }, [aspectRatio]);

  const iframe = (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      aria-label={title}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
      sandbox="allow-forms allow-same-origin allow-scripts allow-popups"
    />
  );

  return (
    <div className={`google-form-embed w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Opinion Survey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Help us improve our platform by sharing your feedback
          </p>
        </div>
        
      {aspectRatio ? (
        <div className="relative w-full overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl" style={ratioStyle}>
          <div className="absolute inset-0">
            {/* when using aspect-ratio wrapper, we force iframe to fill container */}
            <iframe
              src={src}
              title={title}
              loading="lazy"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              aria-label={title}
              style={{ width: "100%", height: "100%", border: 0 }}
              sandbox="allow-forms allow-same-origin allow-scripts allow-popups"
            />
          </div>
        </div>
      ) : (
        // fixed-height rendering (useful when the form is long)
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden" style={{ minHeight: 200 }}>
          {iframe}
        </div>
      )}

      {showOpenButton && (
        <div className="mt-6 flex items-center gap-2 justify-center">
          <a
            href={src.replace("?embedded=true", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Open form in new tab"
          >
            Open form in new tab
          </a>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            If the form doesn't load, open it in a new tab.
          </span>
        </div>
      )}
      </div>
    </div>
  );
}
