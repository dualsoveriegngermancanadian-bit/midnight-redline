import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import {
  COMMERCE_PRODUCTS,
  findCommerceProducts,
  isValidCheckoutCart,
} from "../shared/commerce";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rbcBusinessPaymentsEnabled = process.env.RBC_BUSINESS_PAYMENTS_ENABLED === "true";
const rbcReconciliationSecret = process.env.RBC_RECONCILIATION_SECRET;
const rbcBusinessEmail = process.env.RBC_BUSINESS_EMAIL;

type OrderStatus = "awaiting_bank_confirmation" | "confirmed" | "expired" | "refunded" | "renewal_required";
type PendingOrder = {
  productIds: string[];
  amountCents: number;
  createdAt: string;
  status: OrderStatus;
  bankTransactionReference?: string;
};

// Production deployments should replace this with durable storage plus the bank's verified callback/API.
const pendingBankOrders = new Map<string, PendingOrder>();

function publicOrigin(req: express.Request) {
  const configuredOrigin = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");
  return configuredOrigin || `${req.protocol}://${req.get("host")}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/commerce/catalog", (_req, res) => {
    res.json({
      currency: "cad",
      paymentRail: "rbc_business_request_money",
      checkoutEnabled: rbcBusinessPaymentsEnabled,
      products: COMMERCE_PRODUCTS.map(({ sourceGameValue: _sourceGameValue, ...product }) => product),
    });
  });

  app.get("/api/commerce/status", (_req, res) => {
    res.json({
      paymentRail: "rbc_business_request_money",
      bank: "RBC Royal Bank",
      paymentEnabled: rbcBusinessPaymentsEnabled,
      creatorPayoutCadence: "weekly",
      message: rbcBusinessPaymentsEnabled
        ? "RBC business payment requests are enabled. Entitlements require verified bank confirmation."
        : "RBC business payment requests are not enabled. Complete RBC business enrollment before collecting money.",
    });
  });

  app.post("/api/commerce/rbc-request", (req, res) => {
    if (!rbcBusinessPaymentsEnabled) {
      res.status(503).json({
        error: "RBC business payment requests are not enabled. No payment was requested or collected.",
        paymentRail: "rbc_business_request_money",
      });
      return;
    }

    const productIds = Array.isArray(req.body?.productIds)
      ? req.body.productIds.filter((id: unknown): id is string => typeof id === "string")
      : [];
    const products = findCommerceProducts(productIds);
    if (!products || !isValidCheckoutCart(products)) {
      res.status(400).json({ error: "Invalid catalog selection. Select one lineup subscription or a cart of one-time products." });
      return;
    }

    const amountCents = products.reduce((total, product) => total + (product.amountCents ?? 0), 0);
    const orderReference = `MR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
    pendingBankOrders.set(orderReference, {
      productIds: products.map((product) => product.id),
      amountCents,
      createdAt: new Date().toISOString(),
      status: "awaiting_bank_confirmation",
    });

    res.status(202).json({
      orderReference,
      paymentRail: "rbc_business_request_money",
      bank: "RBC Royal Bank",
      currency: "cad",
      amountCents,
      status: "awaiting_bank_confirmation",
      paymentRequestUrl: null,
      paymentDestinationEmail: rbcBusinessEmail ?? null,
      message: "Order reference created. Send the exact CAD amount by RBC business e-transfer to the designated business destination; access is granted only after verified confirmation.",
      nextStep: `Use order reference ${orderReference} in the RBC business payment request.`,
      origin: publicOrigin(req),
    });
  });

  app.get("/api/commerce/rbc-order/:orderReference", (req, res) => {
    const order = pendingBankOrders.get(req.params.orderReference);
    if (!order) {
      res.status(404).json({ error: "Order reference not found." });
      return;
    }
    res.json({
      orderReference: req.params.orderReference,
      status: order.status,
      amountCents: order.amountCents,
      paymentRail: "rbc_business_request_money",
    });
  });

  app.post("/api/internal/rbc/reconcile", (req, res) => {
    if (!rbcReconciliationSecret || req.headers["x-rbc-reconciliation-secret"] !== rbcReconciliationSecret) {
      res.status(401).json({ error: "RBC reconciliation authorization required." });
      return;
    }

    const orderReference = typeof req.body?.orderReference === "string" ? req.body.orderReference : "";
    const bankTransactionReference = typeof req.body?.bankTransactionReference === "string" ? req.body.bankTransactionReference : "";
    const outcome = req.body?.outcome as OrderStatus;
    const order = pendingBankOrders.get(orderReference);
    if (!order || !bankTransactionReference || !["confirmed", "expired", "refunded", "renewal_required"].includes(outcome)) {
      res.status(400).json({ error: "Invalid reconciliation record." });
      return;
    }
    if (outcome === "confirmed" && typeof req.body?.amountCents !== "number" || outcome === "confirmed" && req.body.amountCents !== order.amountCents) {
      res.status(409).json({ error: "Confirmed bank amount does not match the order amount." });
      return;
    }

    const alreadyUsed = Array.from(pendingBankOrders.values()).some((candidate) => candidate.bankTransactionReference === bankTransactionReference && candidate !== order);
    if (alreadyUsed) {
      res.status(409).json({ error: "Bank transaction reference has already been reconciled." });
      return;
    }

    order.status = outcome;
    order.bankTransactionReference = bankTransactionReference;
    res.json({ orderReference, status: order.status, entitlementReady: order.status === "confirmed" });
  });

  // Static files from dist/public in production.
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

startServer().catch(console.error);
