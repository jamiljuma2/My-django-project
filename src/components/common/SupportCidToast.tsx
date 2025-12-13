"use client";
import React, { useEffect, useState } from "react";
import SupportCidBadge from "./SupportCidBadge";

type ErrorDetail = {
  message?: string;
  status?: number;
  cid?: string | null;
  bodyCid?: string | null;
  error?: string | null;
  url?: string | null;
  method?: string | null;
};

export default function SupportCidToast() {
  const [err, setErr] = useState<ErrorDetail | null>(null);
  const [ok, setOk] = useState<ErrorDetail | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<ErrorDetail>;
      setErr(ce.detail || null);
      // auto-clear after a few seconds
      setTimeout(() => setErr(null), 6000);
    };
    window.addEventListener("api-error", handler as EventListener);
    const okHandler = (e: Event) => {
      const ce = e as CustomEvent<ErrorDetail>;
      setOk(ce.detail || null);
      setTimeout(() => setOk(null), 4000);
    };
    window.addEventListener("api-success", okHandler as EventListener);
    return () => {
      window.removeEventListener("api-error", handler as EventListener);
      window.removeEventListener("api-success", okHandler as EventListener);
    };
  }, []);

  if (!err && !ok) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        padding: 12,
        borderRadius: 8,
        maxWidth: 420,
      }}
    >
      {err && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Request Error</div>
          <div style={{ fontSize: 14, color: "#333" }}>{err.message}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            {err.method?.toUpperCase()} {err.url} → {err.status}
          </div>
          <SupportCidBadge bodyCid={err.bodyCid} headerCid={err.cid} className="mt-2" />
          {err.error && (
            <pre style={{ fontSize: 12, color: "#a00", marginTop: 6 }}>{err.error}</pre>
          )}
        </>
      )}

      {ok && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#0a0" }}>Request Succeeded</div>
          <div style={{ fontSize: 14, color: "#333" }}>{ok.message}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            {ok.method?.toUpperCase()} {ok.url} → {ok.status}
          </div>
          <SupportCidBadge bodyCid={ok.bodyCid} headerCid={ok.cid} className="mt-2" />
        </>
      )}
    </div>
  );
}