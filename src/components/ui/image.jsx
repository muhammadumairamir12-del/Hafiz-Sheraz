import React, { useState } from "react";

export function Image({ src, alt, className = "", focalPointY, style = {}, ...props }) {
  const [error, setError] = useState(false);

  const combinedStyle = {
    ...style,
    ...(focalPointY !== undefined ? { objectPosition: `center ${focalPointY * 100}%` } : {}),
  };

  if (error) {
    return (
      <div
        className={`bg-slate-800/60 flex items-center justify-center text-slate-500 text-xs border border-white/5 ${className}`}
        style={combinedStyle}
      >
        <span>{alt || "Image"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      style={combinedStyle}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
}

export default Image;
