import React from "react";
import { Navigate } from "react-router-dom";

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

// export default function GoogleFormEmbed({
//   src = "https://docs.google.com/forms/d/e/1FAIpQLSeIEeJjK0B0t0SI2jXuY0RhXWIAiHTYjgDOB4Gv2Q-sB888YA/viewform?embedded=true",
//   title = "Embedded Google Form",
//   height = 2000,
//   aspectRatio = undefined,
//   className = "",
//   showOpenButton = true,
// }) {
// If aspectRatio is provided (like '16/9' or '4/3'), convert to padding-top percentage
// const ratioStyle = React.useMemo(() => {
//   if (!aspectRatio) return null;
//   const parts = aspectRatio.split("/").map(Number);
//   if (parts.length !== 2 || parts.some(isNaN)) return null;
//   const [w, h] = parts;
//   const paddingTop = (h / w) * 100;
//   return { paddingTop: `${paddingTop}%` };
// }, [aspectRatio]);

// const iframe = (
//   <iframe
//     src={src}
//     title={title}
//     loading="lazy"
//     frameBorder="0"
//     marginHeight={0}
//     marginWidth={0}
//     aria-label={title}
//     style={{
//       width: "100%",
//       height: typeof height === "number" ? `${height}px` : height,
//     }}
//     sandbox="allow-forms allow-same-origin allow-scripts allow-popups"
//   />
// );

// return (
//   <div className={`google-form-embed w-full ${className}`}>
//     {aspectRatio ? (
//       <div className="relative w-full overflow-hidden" style={ratioStyle}>
//         <div className="absolute inset-0">
//           {/* when using aspect-ratio wrapper, we force iframe to fill container */}
//           <iframe
//             src={src}
//             title={title}
//             loading="lazy"
//             frameBorder="0"
//             marginHeight={0}
//             marginWidth={0}
//             aria-label={title}
//             style={{ width: "100%", height: "100%", border: 0 }}
//             sandbox="allow-forms allow-same-origin allow-scripts allow-popups"
//           />
//         </div>
//       </div>
//     ) : (
//       // fixed-height rendering (useful when the form is long)
//       <div className="w-full" style={{ minHeight: 200 }}>
//         {iframe}
//       </div>
//     )}

//     {showOpenButton && (
//       <div className="mt-3 flex items-center gap-2">
//         <a
//           href={src.replace("?embedded=true", "")}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-block text-sm px-3 py-1 rounded-md border shadow-sm hover:shadow focus:outline-none focus:ring"
//           aria-label="Open form in new tab"
//         >
//           Open form in new tab
//         </a>
//         <span className="text-xs text-muted-foreground">
//           If the form doesn't load, open it in a new tab.
//         </span>
//       </div>
//     )}
//   </div>
// );
// }

export default function GoogleFormEmbed() {
  window.location.href =
    "https://docs.google.com/forms/d/e/1FAIpQLSeIEeJjK0B0t0SI2jXuY0RhXWIAiHTYjgDOB4Gv2Q-sB888YA/viewform?embedded=true";
  return null;

}
