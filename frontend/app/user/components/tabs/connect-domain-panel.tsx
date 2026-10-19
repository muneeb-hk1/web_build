"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Circle,
  Copy,
  Globe2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { getUserActiveSiteId } from "@/lib/migrateGuestSite";
import {
  listDomainConnections,
  reassignDomainConnection,
  removeDomainConnection,
  saveDomainConnection,
  updateDomainConnection,
  type DomainConnection,
  type DomainConnectionMethod,
  type DomainSslStatus,
} from "@/lib/customDomain";
import type { UserSite } from "../types";

const DEFAULT_A_RECORD_IP =
  process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_A_RECORD_IP || "13.205.91.11";
const DEFAULT_NAMESERVERS = (
  process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_NAMESERVERS ||
  "ns1.cssfounder.com,ns2.cssfounder.com"
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

type StatusTone = "pending" | "success";

function StatusDot({ tone }: { tone: StatusTone }) {
  return (
    <span
      className={`grid size-3 shrink-0 place-items-center rounded-full ${
        tone === "success"
          ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]"
          : "bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.18)]"
      }`}
    />
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 transition hover:border-blue-200 hover:text-blue-700"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DnsInstructions({ method }: { method: DomainConnectionMethod }) {
  return (
    <section className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-[0_8px_30px_rgba(24,39,75,.05)] sm:p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-700">
          <ShieldCheck size={15} />
        </span>
        <h3 className="text-sm font-semibold text-zinc-950">
          DNS setup instructions
        </h3>
      </div>

      {method === "a-record" ? (
        <div className="mt-4 space-y-2.5">
          <p className="text-[11px] leading-5 text-zinc-500">
            Go to your domain provider and add these A records:
          </p>
          {[
            { host: "@", value: DEFAULT_A_RECORD_IP },
            { host: "www", value: DEFAULT_A_RECORD_IP },
          ].map((record) => (
            <div
              key={record.host}
              className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5"
            >
              <div className="grid gap-2 sm:grid-cols-[80px_80px_1fr_auto] sm:items-center">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    Type
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-zinc-900">A</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    Host
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-zinc-900">
                    {record.host}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    Value / IP
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] font-semibold text-zinc-950">
                    {record.value}
                  </p>
                </div>
                <CopyButton value={record.value} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          <p className="text-[11px] leading-5 text-zinc-500">
            Go to your domain provider and replace the nameservers with:
          </p>
          {DEFAULT_NAMESERVERS.length ? (
            DEFAULT_NAMESERVERS.map((nameserver) => (
              <div
                key={nameserver}
                className="flex flex-col gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    Nameserver
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] font-semibold text-zinc-950">
                    {nameserver}
                  </p>
                </div>
                <CopyButton value={nameserver} />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">
              Nameserver values are not configured yet. Add{" "}
              <code className="font-mono">NEXT_PUBLIC_CUSTOM_DOMAIN_NAMESERVERS</code>{" "}
              in env.
            </div>
          )}
        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-[10px] leading-4 text-amber-900">
        DNS changes can take up to <strong>24 hours</strong> to propagate
        worldwide. After updating records, click verify DNS.
      </div>
    </section>
  );
}

export default function ConnectDomainPanel({
  sites,
  loadingSites,
}: {
  sites: UserSite[];
  loadingSites: boolean;
}) {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState("");
  const [method, setMethod] = useState<DomainConnectionMethod>("a-record");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [connections, setConnections] = useState<DomainConnection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sslWorking, setSslWorking] = useState(false);
  const [reassignSiteId, setReassignSiteId] = useState("");
  const [reassigning, setReassigning] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) || null,
    [selectedSiteId, sites],
  );
  const activeConnection =
    connections.find((item) => item.id === activeId) || connections[0] || null;

  const connectionBySiteId = useMemo(() => {
    const map = new Map<string, DomainConnection>();
    for (const connection of connections) {
      if (connection.siteId) {
        map.set(connection.siteId, connection);
      }
    }
    return map;
  }, [connections]);

  const publishedSites = useMemo(
    () => sites.filter((site) => site.published),
    [sites],
  );

  const selectableSites = useMemo(
    () => publishedSites.filter((site) => !connectionBySiteId.has(site.id)),
    [connectionBySiteId, publishedSites],
  );

  useEffect(() => {
    if (loadingSites) return;

    const pickIfSelectable = (id: string | null | undefined) =>
      id && selectableSites.some((site) => site.id === id) ? id : null;

    const preferred =
      pickIfSelectable(searchParams.get("siteId")) ||
      pickIfSelectable(getUserActiveSiteId()) ||
      selectableSites[0]?.id ||
      "";

    setSelectedSiteId((current) => {
      if (current && selectableSites.some((site) => site.id === current)) {
        return current;
      }
      return preferred;
    });
  }, [loadingSites, searchParams, selectableSites]);

  const refreshConnections = useCallback(() => {
    const next = listDomainConnections();
    setConnections(next);
    setActiveId((current) => current || next[0]?.id || null);
  }, []);

  useEffect(() => {
    refreshConnections();
  }, [refreshConnections]);

  useEffect(() => {
    if (activeConnection) {
      setMethod(activeConnection.method);
      setReassignSiteId(activeConnection.siteId || "");
    }
  }, [activeConnection?.id, activeConnection?.method, activeConnection?.siteId]);

  const reassignableSites = useMemo(() => {
    if (!activeConnection) return publishedSites;
    return publishedSites.filter((site) => {
      const linked = connectionBySiteId.get(site.id);
      return !linked || linked.id === activeConnection.id;
    });
  }, [activeConnection, connectionBySiteId, publishedSites]);

  const dnsVerified = activeConnection?.status === "verified";
  const sslActive = activeConnection?.sslStatus === "active";
  const reassignDirty =
    Boolean(activeConnection?.siteId) &&
    Boolean(reassignSiteId) &&
    reassignSiteId !== activeConnection?.siteId;

  const applySslStatus = useCallback(
    (connectionId: string, sslStatus: DomainSslStatus, message?: string) => {
      const checkedAt = new Date().toISOString();
      updateDomainConnection(connectionId, {
        sslStatus,
        sslCheckedAt: checkedAt,
      });
      refreshConnections();
      if (message) setNotice(message);
    },
    [refreshConnections],
  );

  const syncSslStatus = useCallback(
    async (connection: DomainConnection, provision: boolean) => {
      const endpoint = provision
        ? "/api/user/domains/connect/ssl"
        : `/api/user/domains/connect/ssl?domain=${encodeURIComponent(connection.domain)}`;
      const response = await fetch(endpoint, {
        method: provision ? "POST" : "GET",
        credentials: "include",
        cache: "no-store",
        ...(provision
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain: connection.domain }),
            }
          : {}),
      });
      const data = (await response.json().catch(() => ({}))) as {
        sslStatus?: DomainSslStatus;
        message?: string;
      };
      const nextStatus: DomainSslStatus =
        data.sslStatus === "active"
          ? "active"
          : data.sslStatus === "failed"
            ? "failed"
            : "pending";
      applySslStatus(
        connection.id,
        nextStatus,
        provision || nextStatus === "active" ? data.message : undefined,
      );
      if (provision && !response.ok && nextStatus !== "active") {
        throw new Error(data.message || "Unable to enable SSL right now.");
      }
      return nextStatus;
    },
    [applySslStatus],
  );

  useEffect(() => {
    if (!activeConnection || activeConnection.status !== "verified") return;
    // Auto-detect once when status is unknown (e.g. already-issued certs).
    if (activeConnection.sslStatus) return;
    const connection = activeConnection;
    let cancelled = false;
    void (async () => {
      try {
        await syncSslStatus(connection, false);
      } catch {
        if (!cancelled) {
          applySslStatus(connection.id, "pending");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    activeConnection,
    applySslStatus,
    syncSslStatus,
  ]);

  const handleMethodChange = (nextMethod: DomainConnectionMethod) => {
    setMethod(nextMethod);
    if (activeConnection) {
      updateDomainConnection(activeConnection.id, {
        method: nextMethod,
        status: "pending",
        verifiedAt: undefined,
      });
      refreshConnections();
    }
  };

  const handleAddDomain = () => {
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      if (!selectedSite) {
        throw new Error("Please select a website to connect this domain with.");
      }

      if (!selectedSite.published) {
        throw new Error("Only live websites can be connected to a custom domain.");
      }

      if (connectionBySiteId.has(selectedSite.id)) {
        throw new Error("This website is already connected to a domain.");
      }

      const connection = saveDomainConnection({
        domain,
        method,
        siteId: selectedSite.id,
        siteTitle: selectedSite.title,
        siteSlug: selectedSite.slug,
      });
      setDomain("");
      refreshConnections();
      setActiveId(connection.id);
      setNotice(
        "Domain added. Update your DNS records below, then verify after propagation.",
      );
    } catch (addError) {
      setError(
        addError instanceof Error ? addError.message : "Unable to add domain.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!activeConnection) return;

    setVerifying(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/user/domains/connect/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: activeConnection.domain,
          method,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        verified?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Unable to verify DNS right now.");
      }

      const checkedAt = new Date().toISOString();
      updateDomainConnection(activeConnection.id, {
        status: data.verified ? "verified" : "pending",
        verifiedAt: data.verified ? checkedAt : undefined,
        lastCheckedAt: checkedAt,
        method,
      });
      refreshConnections();
      setNotice(
        data.message ||
          (data.verified
            ? "DNS verified successfully."
            : "DNS not verified yet. Please wait up to 24 hours and try again."),
      );

      if (data.verified) {
        setSslWorking(true);
        try {
          await syncSslStatus(
            { ...activeConnection, status: "verified" },
            true,
          );
        } catch (sslError) {
          setError(
            sslError instanceof Error
              ? sslError.message
              : "DNS verified, but SSL could not be enabled yet.",
          );
        } finally {
          setSslWorking(false);
        }
      }
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Unable to verify DNS right now.",
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleEnableSsl = async () => {
    if (!activeConnection) return;
    setSslWorking(true);
    setError("");
    setNotice("");
    try {
      await syncSslStatus(activeConnection, true);
    } catch (sslError) {
      setError(
        sslError instanceof Error
          ? sslError.message
          : "Unable to enable SSL right now.",
      );
    } finally {
      setSslWorking(false);
    }
  };

  const handleReassignWebsite = () => {
    if (!activeConnection) return;
    setError("");
    setNotice("");
    setReassigning(true);
    try {
      const site =
        publishedSites.find((item) => item.id === reassignSiteId) || null;
      if (!site) {
        throw new Error("Please select a live website.");
      }
      reassignDomainConnection(activeConnection.id, {
        siteId: site.id,
        siteTitle: site.title,
        siteSlug: site.slug,
      });
      refreshConnections();
      setNotice(
        `Domain now points to “${site.title}”. Open https://${activeConnection.domain}/ to check.`,
      );
    } catch (reassignError) {
      setError(
        reassignError instanceof Error
          ? reassignError.message
          : "Unable to change website.",
      );
    } finally {
      setReassigning(false);
    }
  };

  const handleRemove = (id: string) => {
    removeDomainConnection(id);
    refreshConnections();
    if (activeId === id) {
      setActiveId(null);
    }
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_40px_rgba(24,39,75,.07)]">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Connect third party domain
          </h3>
          <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
            Connect a domain you already own from GoDaddy, Namecheap, or another
            provider. Update DNS, then verify once records propagate.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-3">
            <div>
              <label
                htmlFor="connect-domain-website"
                className="text-xs font-semibold text-zinc-800 sm:text-sm"
              >
                Which website do you want to connect?
              </label>
              <p className="mt-0.5 text-xs text-zinc-500">
                Only live websites can be connected. Draft websites are hidden.
              </p>
              <div className="relative mt-2">
                <Globe2
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <select
                  id="connect-domain-website"
                  value={selectedSiteId}
                  onChange={(event) => setSelectedSiteId(event.target.value)}
                  disabled={loadingSites || publishedSites.length === 0}
                  className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-9 text-sm font-medium text-zinc-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingSites
                      ? "Loading websites..."
                      : selectableSites.length
                        ? "Select a website"
                        : "No available websites"}
                  </option>
                  {publishedSites.map((site) => {
                    const connection = connectionBySiteId.get(site.id);
                    const connected = Boolean(connection);

                    return (
                      <option key={site.id} value={site.id} disabled={connected}>
                        {site.title} ({site.slug}) · Live
                        {connected ? ` · Connected (${connection?.domain})` : ""}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
              {!loadingSites && publishedSites.length === 0 ? (
                <p className="mt-1.5 text-xs text-amber-700">
                  Publish a website first before connecting a custom domain.
                </p>
              ) : null}
              {!loadingSites &&
              publishedSites.length > 0 &&
              selectableSites.length === 0 ? (
                <p className="mt-1.5 text-xs text-zinc-500">
                  All live websites are already connected to a domain.
                </p>
              ) : null}
              {selectedSite ? (
                <p className="mt-1.5 text-xs text-zinc-500">
                  Current URL:{" "}
                  <span className="font-mono">/published/{selectedSite.slug}</span>
                </p>
              ) : null}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="example.com"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
              <button
                type="button"
                onClick={handleAddDomain}
                disabled={submitting || !domain.trim() || !selectedSiteId}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Adding..." : "Add domain"}
              </button>
            </div>
          </div>

          <div className="mt-3 inline-flex w-full items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => handleMethodChange("a-record")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none sm:px-4 ${
                method === "a-record"
                  ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              A Record (IP)
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange("nameserver")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none sm:px-4 ${
                method === "nameserver"
                  ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Nameservers
            </button>
          </div>

          {error ? (
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
              {notice}
            </div>
          ) : null}
        </div>
      </section>

      <DnsInstructions method={method} />

      {activeConnection ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-400">
                Active domain
              </p>
              <h3 className="mt-1 text-base font-bold text-zinc-950">
                {activeConnection.domain}
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                Method: {method === "a-record" ? "A Record" : "Nameservers"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                <StatusDot tone={dnsVerified ? "success" : "pending"} />
                <span
                  className={`text-xs font-semibold ${
                    dnsVerified ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {dnsVerified ? "DNS connected" : "Waiting for DNS"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                <StatusDot tone={sslActive ? "success" : "pending"} />
                <span
                  className={`text-xs font-semibold ${
                    sslActive ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {sslActive ? "SSL active" : "SSL pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3">
            <label
              htmlFor="reassign-domain-website"
              className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-400"
            >
              Connected website
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <select
                  id="reassign-domain-website"
                  value={reassignSiteId}
                  onChange={(event) => setReassignSiteId(event.target.value)}
                  disabled={loadingSites || reassignableSites.length === 0}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-sm font-medium text-zinc-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:opacity-60"
                >
                  {reassignableSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.title} ({site.slug}) · Live
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
              <button
                type="button"
                onClick={handleReassignWebsite}
                disabled={!reassignDirty || reassigning || !reassignSiteId}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {reassigning ? "Saving..." : "Change website"}
              </button>
            </div>
            {activeConnection.siteSlug ? (
              <p className="mt-1.5 text-[11px] text-zinc-500">
                Current path:{" "}
                <span className="font-mono">
                  /published/{activeConnection.siteSlug}
                </span>
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
              <StatusDot tone="success" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  Domain added
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Saved and ready for DNS setup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
              <StatusDot tone={dnsVerified ? "success" : "pending"} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900">
                  DNS records updated
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Add records at your provider, then wait up to 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
              <StatusDot tone={dnsVerified ? "success" : "pending"} />
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  Domain live on your website
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Turns green once DNS is verified.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
              <StatusDot tone={sslActive ? "success" : "pending"} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900">SSL active</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {sslActive
                    ? `HTTPS is live at https://${activeConnection.domain}/`
                    : "Enable free SSL after DNS is connected (Let's Encrypt)."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={verifying || sslWorking}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {verifying ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  Verify DNS
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void handleEnableSsl()}
              disabled={!dnsVerified || sslActive || sslWorking || verifying}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
            >
              {sslWorking ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Enabling SSL...
                </>
              ) : sslActive ? (
                <>
                  <ShieldCheck size={13} />
                  SSL active
                </>
              ) : (
                <>
                  <ShieldCheck size={13} />
                  Enable SSL
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleRemove(activeConnection.id)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Remove domain
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-5 py-8 text-center">
          <Circle size={24} className="mx-auto text-zinc-300" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            Add a domain to track connection status
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            DNS instructions appear above. After adding your domain, verify DNS
            and watch the status turn green.
          </p>
        </section>
      )}

      {connections.length > 1 ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-400">
            Saved domains
          </h3>
          <div className="mt-3 space-y-1.5">
            {connections.map((connection) => (
              <button
                key={connection.id}
                type="button"
                onClick={() => setActiveId(connection.id)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition ${
                  activeConnection?.id === connection.id
                    ? "border-blue-200 bg-blue-50/60 ring-1 ring-blue-100"
                    : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200"
                }`}
              >
                <span className="text-sm font-semibold text-zinc-950">
                  {connection.domain}
                </span>
                <span className="text-right">
                  <span className="block text-xs text-zinc-500">
                    {connection.siteTitle || "Website"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <StatusDot
                      tone={connection.status === "verified" ? "success" : "pending"}
                    />
                    {connection.status === "verified" ? "Connected" : "Pending"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
