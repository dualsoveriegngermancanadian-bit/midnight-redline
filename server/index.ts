import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import {
  COMMERCE_PRODUCTS,
  findCommerceProducts,
  isValidCheckoutCart,
} from "../shared/commerce";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function checkoutIsConfigured() {
  return Boolean(stripe);
}

function publicOrigin(req: express.Request) {
  const configuredOrigin = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredOrigin) return configuredOrigin;
  return `${req.protocol}://${req.get("host")}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Stripe must receive the untouched raw body so it can verify event signatures.
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    if (!stripe || !stripeWebhookSecret) {
      res.status(503).json({ error: "Stripe webhooks are not configured." });
      return;
    }

    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") {
      res.status(400).json({ error: "Missing Stripe signature." });
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
    } catch (error) {
      res.status(400).json({ error: "Invalid Stripe signature." });
      return;
    }

    // A production deployment persists idempotency keys and entitlements in its database.
    // This repository intentionally never grants access based on a browser redirect alone.
    if (
      event.type === "checkout.session.completed" ||
      event.type === "invoice.paid" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      console.info("Verified Stripe commerce event", { id: event.id, type: event.type });
    }

    res.json({ received: true });
  });

  app.use(express.json({ limit: "20kb" }));

  app.get("/api/commerce/catalog", (_req, res) => {
    res.json({
      currency: "usd",
      checkoutEnabled: checkoutIsConfigured(),
      products: COMMERCE_PRODUCTS.map(({ sourceGameValue: _sourceGameValue, ...product }) => product),
    });
  });

  app.get("/api/commerce/status", (_req, res) => {
    res.json({
      checkoutEnabled: checkoutIsConfigured(),
      webhooksConfigured: Boolean(stripe && stripeWebhookSecret),
      message: checkoutIsConfigured()
        ? "Stripe checkout is configured. Entitlements must be granted by verified webhook events."
        : "Stripe checkout is not configured. Add server-side Stripe credentials only after catalog approval.",
    });
  });

  app.post("/api/commerce/checkout", async (req, res) => {
    if (!stripe) {
      res.status(503).json({
        error: "Stripe checkout is not configured. No payment can be collected until the creator connects Stripe and configures server-side credentials.",
      });
      return;
    }

    const productIds = Array.isArray(req.body?.productIds)
      ? req.body.productIds.filter((id: unknown): id is string => typeof id === "string")
      : [];
    const products = findCommerceProducts(productIds);

    if (!products || !isValidCheckoutCart(products)) {
      res.status(400).json({
        error: "Invalid catalog selection. Select one lineup subscription or a cart of one-time products.",
      });
      return;
    }

    const prices = await stripe.prices.list({
      lookup_keys: products.map((product) => product.lookupKey),
      active: true,
      limit: products.length,
    });
    const pricesByLookupKey = new Map(prices.data.map((price) => [price.lookup_key, price]));
    const missingPrice = products.find((product) => !pricesByLookupKey.has(product.lookupKey));

    if (missingPrice) {
      res.status(503).json({
        error: `The Stripe price for ${missingPrice.name} has not been configured yet.`,
      });
      return;
    }

    const subscription = products[0].billingMode === "subscription";
    const origin = publicOrigin(req);

    try {
      const checkout = await stripe.checkout.sessions.create({
        mode: subscription ? "subscription" : "payment",
        line_items: products.map((product) => ({
          price: pricesByLookupKey.get(product.lookupKey)!.id,
          quantity: 1,
        })),
        success_url: `${origin}/?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?stripe=cancelled`,
        allow_promotion_codes: true,
        automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
        metadata: {
          product_ids: products.map((product) => product.id).join(","),
          entitlement_source: "verified_stripe_webhook_required",
        },
      });

      if (!checkout.url) {
        res.status(500).json({ error: "Stripe did not return a checkout URL." });
        return;
      }

      res.json({ url: checkout.url });
    } catch (error) {
      console.error("Stripe Checkout Session creation failed", error);
      res.status(502).json({ error: "Stripe could not start checkout. No payment was collected." });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
