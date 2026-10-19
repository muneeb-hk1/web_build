export type InvoiceDownloadInput = {
  id: string;
  date: string;
  amount: string;
  plan: string;
  website: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  /** stripe | razorpay — shown in footer */
  paymentGateway?: "stripe" | "razorpay" | string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inferPaymentGateway(
  invoiceId: string,
  explicit?: string,
): "Stripe" | "Razorpay" {
  const raw = (explicit || "").trim().toLowerCase();
  if (raw === "stripe") return "Stripe";
  if (raw === "razorpay") return "Razorpay";
  const id = invoiceId.trim();
  if (
    id.startsWith("cs_") ||
    id.startsWith("pi_") ||
    id.startsWith("ch_") ||
    id.startsWith("in_")
  ) {
    return "Stripe";
  }
  return "Razorpay";
}

function formatInvoiceRef(id: string) {
  const value = id.trim();
  if (value.length <= 28) {
    return { display: value, full: value, truncated: false };
  }
  return {
    display: `${value.slice(0, 10)}…${value.slice(-8)}`,
    full: value,
    truncated: true,
  };
}

function buildInvoiceHtml(invoice: InvoiceDownloadInput) {
  const issuedOn = invoice.date || new Date().toLocaleDateString();
  const customerName = invoice.customerName?.trim() || "Customer";
  const customerEmail = invoice.customerEmail?.trim() || "—";
  const gateway = inferPaymentGateway(invoice.id, invoice.paymentGateway);
  const ref = formatInvoiceRef(invoice.id);
  const website =
    invoice.website?.trim() &&
    !/^this website$/i.test(invoice.website.trim())
      ? invoice.website.trim()
      : "Untitled website";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(ref.display)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #18181b;
      background: #fff;
    }
    .page {
      max-width: 740px;
      margin: 32px auto;
      background: #fff;
      border: 1px solid #e4e4e7;
      border-radius: 18px;
      padding: 40px;
      overflow: hidden;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      border-bottom: 1px solid #e4e4e7;
      padding-bottom: 24px;
    }
    .header-right {
      text-align: right;
      min-width: 0;
      max-width: min(280px, 48%);
    }
    .brand {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .muted { color: #71717a; font-size: 13px; line-height: 1.5; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: #ecfdf5;
      color: #047857;
    }
    .invoice-id {
      margin-top: 4px;
      color: #18181b;
      font-size: 12px;
      font-weight: 700;
      font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
      line-height: 1.35;
      word-break: break-all;
      overflow-wrap: anywhere;
    }
    .invoice-id-full {
      margin-top: 6px;
      font-size: 10px;
      font-weight: 500;
      color: #a1a1aa;
      word-break: break-all;
      overflow-wrap: anywhere;
      line-height: 1.4;
    }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 28px;
    }
    .label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a1a1aa;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 32px;
      table-layout: fixed;
    }
    th, td {
      text-align: left;
      padding: 14px 12px;
      border-bottom: 1px solid #f4f4f5;
      font-size: 14px;
      word-break: break-word;
    }
    th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #71717a;
      background: #fafafa;
    }
    .total {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }
    .total-box {
      min-width: 240px;
      border: 1px solid #e4e4e7;
      border-radius: 14px;
      padding: 16px 18px;
      background: #fafafa;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      font-size: 14px;
    }
    .total-row strong { font-size: 18px; }
    .footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid #e4e4e7;
      font-size: 12px;
      color: #71717a;
      line-height: 1.6;
    }
    @media print {
      .page {
        margin: 0;
        border: none;
        border-radius: 0;
        max-width: none;
        padding: 0;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="brand">Lestow</div>
        <div class="muted" style="margin-top:6px">
          AI Website Builder<br />
          billing@cssfounder.com
        </div>
      </div>
      <div class="header-right">
        <div class="badge">${escapeHtml(invoice.status || "Paid")}</div>
        <div class="muted" style="margin-top:12px">
          Invoice<br />
          <div class="invoice-id" title="${escapeHtml(ref.full)}">${escapeHtml(ref.display)}</div>
          ${
            ref.truncated
              ? `<div class="invoice-id-full">${escapeHtml(ref.full)}</div>`
              : ""
          }
        </div>
      </div>
    </div>

    <div class="meta">
      <div>
        <div class="label">Billed to</div>
        <div style="font-weight:600">${escapeHtml(customerName)}</div>
        <div class="muted">${escapeHtml(customerEmail)}</div>
      </div>
      <div>
        <div class="label">Invoice details</div>
        <div class="muted">Date: <strong style="color:#18181b">${escapeHtml(issuedOn)}</strong></div>
        <div class="muted">Item: <strong style="color:#18181b">${escapeHtml(invoice.plan)}</strong></div>
        <div class="muted">Website / domain: <strong style="color:#18181b">${escapeHtml(website)}</strong></div>
        <div class="muted">Gateway: <strong style="color:#18181b">${gateway}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Reference</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(invoice.plan)}</td>
          <td>${escapeHtml(website)}</td>
          <td>${escapeHtml(invoice.amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="total">
      <div class="total-box">
        <div class="total-row">
          <span class="muted">Total paid</span>
          <strong>${escapeHtml(invoice.amount)}</strong>
        </div>
      </div>
    </div>

    <div class="footer">
      This is a computer-generated invoice from Lestow.
      Payments are processed securely via ${gateway}.
      For billing help, email billing@cssfounder.com.
    </div>
  </div>
</body>
</html>`;
}

export function downloadInvoice(invoice: InvoiceDownloadInput) {
  if (typeof window === "undefined") return;

  const html = buildInvoiceHtml(invoice);
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    window.alert(
      "Please allow popups for this site to download the invoice as PDF.",
    );
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  printWindow.setTimeout(() => {
    printWindow.print();
  }, 300);
}
