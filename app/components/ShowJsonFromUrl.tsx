"use client";

import React, { useEffect, useState } from "react";

interface ShowJsonFromUrlProps {
  url: string;
}

const INDENT = 16;

const Expandable: React.FC<{
  label?: string;
  value: any;
  level?: number;
}> = ({ label, value, level = 0 }) => {
  const [open, setOpen] = useState(level === 0);

  const isObject = value && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);

  return (
    <div style={{ marginLeft: level > 0 ? INDENT : 0 }}>
      {(isObject || isArray) ? (
        <div>
          <span
            style={{ cursor: "pointer", color: "#0070f3", userSelect: "none" }}
            onClick={() => setOpen(o => !o)}
          >
            [{open ? "-" : "+"}] {label ? `"${label}": ` : ""}
            {isArray ? "[" : "{"}
          </span>
          {open && (
            <div>
              {isArray
                ? value.map((v: any, i: number) => (
                    <Expandable key={i} value={v} level={level + 1} />
                  ))
                : Object.entries(value).map(([k, v]) => (
                    <Expandable key={k} label={k} value={v} level={level + 1} />
                  ))}
            </div>
          )}
          <span>{isArray ? "]" : "}"}</span>
        </div>
      ) : (
        <div>
          {label ? `"${label}": ` : ""}
          <span style={{ color: "#d14" }}>
            {typeof value === "string"
              ? `"${value}"`
              : String(value)}
          </span>
        </div>
      )}
    </div>
  );
};

const ShowJsonFromUrl: React.FC<ShowJsonFromUrlProps> = ({ url }) => {
  const [json, setJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch JSON");
        return res.json();
      })
      .then(setJson)
      .catch(err => setError(err.message));
  }, [url]);

  const handleDownload = () => {
    if (!json) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!json) return <div>Loading JSON...</div>;

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <button
        onClick={handleDownload}
        title="Download JSON"
        style={{
          position: "absolute",
          top: 32,
          right: 32,
          zIndex: 2,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 17h12" stroke="#3a3a3aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 4, fontSize: 14, overflowX: "auto" }}>
        <Expandable value={json} />
      </pre>
    </div>
  );
};

export default ShowJsonFromUrl;