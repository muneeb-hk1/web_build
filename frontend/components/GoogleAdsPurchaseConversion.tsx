"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const GOOGLE_ADS_SEND_TO = "AW-18402848218/u5cFCMHl8_8cENrblMdE";
const FIRED_KEY = "lestow_gads_purchase_fired";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function parseUsdValue(rawValue: string, amountLabel: string): number {
  if (rawValue) {
    const fromParam = Number(rawValue);
    if (Number.isFinite(fromParam) && fromParam >= 0) return fromParam;
  }
  const digits = amountLabel.replace(/[^0-9.]/g, "");
  const fromLabel = Number(digits);
  return Number.isFinite(fromLabel) && fromLabel >= 0 ? fromLabel : 0;
}

/** Fires Google Ads purchase conversion once per transaction on /payment-success. */
export default function GoogleAdsPurchaseConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const transactionId =
      searchParams.get("txn")?.trim() ||
      searchParams.get("paymentId")?.trim() ||
      "";
    const amountLabel = searchParams.get("amount")?.trim() || "";
    const value = parseUsdValue(
      searchParams.get("value")?.trim() || "",
      amountLabel,
    );
    if (!transactionId && value <= 0) return;

    const dedupeKey = `${FIRED_KEY}:${transactionId || amountLabel || value}`;
    try {
      if (sessionStorage.getItem(dedupeKey) === "1") return;
      sessionStorage.setItem(dedupeKey, "1");
    } catch {
      /* ignore */
    }

    const fire = () => {
      if (typeof window.gtag !== "function") return false;
      window.gtag("event", "conversion", {
        send_to: GOOGLE_ADS_SEND_TO,
        value,
        currency: "USD",
        transaction_id: transactionId || undefined,
      });
      return true;
    };

    if (fire()) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (fire() || attempts >= 20) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [searchParams]);

  return null;
}
