"use client";
import React, { useState } from "react";
import ApiClient from "../../services/api";
import SupportCidBadge from "./SupportCidBadge";

const client = new ApiClient();

type StatusData = {
  status: string;
  message?: string;
  data?: any;
  error?: string | null;
};

export default function StatusPing() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ping = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await client.client.get("/api/status/");
      const cid = res.headers?.["x-correlation-id"] || res.headers?.["X-Correlation-ID"]; // axios lower-cases headers
      const dataWithCidHeader = {
        ...(res.data || {}),
        headerCid: cid || null,
      } as any;
      setResult(dataWithCidHeader);
    } catch (e: any) {
      const msg = e?.message || e?.response?.data?.message || "Request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <h3>Backend Status</h3>
      <button onClick={ping} disabled={loading} style={{ padding: "8px 12px" }}>
        {loading ? "Checking..." : "Ping /api/status"}
      </button>
      {/* CID badges for support/debugging */}
      {result && (
        <SupportCidBadge
          className="mt-3"
          bodyCid={(result as any)?.data?.cid || null}
          headerCid={(result as any)?.headerCid || null}
        />
      )}
      {error && (
        <pre style={{ color: "#b00020", marginTop: 12 }}>{error}</pre>
      )}
      {result && (
        <pre style={{ marginTop: 12 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}