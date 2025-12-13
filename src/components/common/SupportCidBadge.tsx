"use client";
import React from "react";

type Props = {
  bodyCid?: string | null;
  headerCid?: string | null;
  className?: string;
};

export default function SupportCidBadge({ bodyCid, headerCid, className }: Props) {
  if (!bodyCid && !headerCid) return null;

  return (
    <div className={className} style={{ display: "flex", gap: 12 }}>
      {bodyCid ? (
        <span style={{ background: "#eef", border: "1px solid #aac", padding: "4px 8px", borderRadius: 6 }}>
          Body CID: {String(bodyCid)}
        </span>
      ) : null}
      {headerCid ? (
        <span style={{ background: "#efe", border: "1px solid #aca", padding: "4px 8px", borderRadius: 6 }}>
          Header CID: {String(headerCid)}
        </span>
      ) : null}
    </div>
  );
}