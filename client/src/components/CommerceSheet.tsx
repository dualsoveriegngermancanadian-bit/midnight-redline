import { useMemo, useState } from "react";
import { Check, CircleDollarSign, LockKeyhole, ShoppingCart } from "lucide-react";
import {
  GARAGE_MICRO_PRODUCTS,
  LINEUP_SUBSCRIPTIONS,
  RACE_ACCESS_PRODUCTS,
  VEHICLE_PRODUCTS,
  formatUsd,
  type CommerceProduct,
} from "@shared/commerce";

type Props = {
  onDemoActivate: () => void;
};

type CheckoutState = "idle" | "loading" | "error";

export default function CommerceSheet({ onDemoActivate }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState(LINEUP_SUBSCRIPTIONS[0].id);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [notice, setNotice] = useState("Choose your lineup term, then build a cart from the garage catalog.");
  const demoMode = new URLSearchParams(window.location.search).has("demo");
  const selectedPlan = LINEUP_SUBSCRIPTIONS.find((plan) => plan.id === selectedPlanId) ?? LINEUP_SUBSCRIPTIONS[0];
  const cartProducts = useMemo(
    () => [...VEHICLE_PRODUCTS, ...GARAGE_MICRO_PRODUCTS].filter((product) => cartProductIds.includes(product.id)),
    [cartProductIds],
  );
  const cartTotal = cartProducts.reduce((total, product) => total + (product.amountCents ?? 0), 0);
  const raceEntry = RACE_ACCESS_PRODUCTS[0];

  const changePlan = (plan: CommerceProduct) => {
    setSelectedPlanId(plan.id);
    setCheckoutState("idle");
    setNotice(`${plan.name} selected. This plan unlocks the active race-car lineup for its full term.`);
  };

  const toggleCart = (product: CommerceProduct) => {
    setCartProductIds((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id]);
    setCheckoutState("idle");
    setNotice(product.id === "night-paint" ? "Finish added to your garage cart." : `${product.name} updated in your garage cart.`);
  };

  const beginCheckout = async (productIds: string[]) => {
    setCheckoutState("loading");
    setNotice("Preparing secure RBC business payment request…");

    try {
      const response = await fetch("/api/commerce/rbc-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.orderReference !== "string") {
        throw new Error(payload.error || "RBC business payment requests are not available yet.");
      }
      setCheckoutState("idle");
      setNotice(`${payload.message || "Complete the RBC business payment request."} Reference: ${payload.orderReference}`);
    } catch (error) {
      setCheckoutState("error");
      setNotice(error instanceof Error ? error.message : "Checkout is not available yet.");
    }
  };

  return <>
    <div className="sheet-eyebrow">COMPETITIVE GARAGE <span>—</span> PAYABLE CATALOG</div>
    <section className="commerce-intro">
      <div><span>RACE THE FULL LINEUP</span><h2>Choose the garage.<br />Build the car.</h2><p>A prepaid lineup term keeps multiple cars race-ready while you tune, qualify, and progress toward The Architect’s final host run. Renew before the covered-through date to keep racing.</p></div>
      <aside><CircleDollarSign size={20} /><b>WEEKLY<br />CREATOR PAYOUTS</b><small>RBC business payment request. No financial details are collected in-game.</small></aside>
    </section>

    <div className="commerce-section-title">LINEUP ACCESS <small>PREPAID TERM</small></div>
    <div className="lineup-grid">
      {LINEUP_SUBSCRIPTIONS.map((plan) => <button key={plan.id} className={`lineup-plan ${plan.id === selectedPlan.id ? "selected" : ""}`} onClick={() => changePlan(plan)}>
        <span>{plan.intervalMonths} MONTH{plan.intervalMonths === 1 ? "" : "S"}</span><b>{formatUsd(plan.amountCents)}</b><small>PAID UP FRONT · {plan.intervalMonths} MONTH{plan.intervalMonths === 1 ? "" : "S"} COVERAGE</small><i>{plan.id === selectedPlan.id ? <Check size={14} /> : "SELECT"}</i>
      </button>)}
    </div>
    <div className="commerce-action-row"><div><b>{selectedPlan.name}</b><span>Prepaid lineup access · garage · dyno · qualifiers · host progression</span></div><button className="primary-button" disabled={checkoutState === "loading"} onClick={() => beginCheckout([selectedPlan.id])}>{checkoutState === "loading" ? "PREPARING…" : `REQUEST ${formatUsd(selectedPlan.amountCents)}`} <LockKeyhole size={15} /></button></div>

    <div className="commerce-section-title">QUALIFIER ACCESS <small>ACTIVE MEMBERS</small></div>
    <div className="race-access-card"><div><span>ONE EVENT ENTRY</span><b>{formatUsd(raceEntry.amountCents)} <small>PER RACE</small></b><p>Every eligible qualifier requires an active prepaid lineup term and a separately verified entry entitlement.</p></div><button className="minor-button" disabled={checkoutState === "loading"} onClick={() => beginCheckout([raceEntry.id])}>ADD RACE ENTRY</button></div>

    <div className="commerce-section-title">VEHICLE ACCESS <small>PERMANENT UNLOCKS</small></div>
    <div className="commerce-catalog vehicle-catalog">
      {VEHICLE_PRODUCTS.map((product) => {
        const included = cartProductIds.includes(product.id);
        return <button key={product.id} className={`commerce-product ${included ? "in-cart" : ""}`} onClick={() => toggleCart(product)}><span>{product.category.toUpperCase()}</span><b>{product.name}</b><small>{product.description}</small><em>{formatUsd(product.amountCents)}</em><i>{included ? "IN CART" : "ADD"}</i></button>;
      })}
    </div>

    <div className="commerce-section-title">GARAGE CART <small>COMBINE PARTS TO REDUCE REPEATED FEES</small></div>
    <div className="commerce-catalog">
      {GARAGE_MICRO_PRODUCTS.map((product) => {
        const included = cartProductIds.includes(product.id);
        return <button key={product.id} className={`commerce-product ${included ? "in-cart" : ""}`} onClick={() => toggleCart(product)}><span>{product.category.toUpperCase()}</span><b>{product.name}</b><small>{product.description}</small><em>{formatUsd(product.amountCents)}</em><i>{included ? "IN CART" : "ADD"}</i></button>;
      })}
    </div>
    <div className="cart-checkout"><div><ShoppingCart size={17} /><span><b>{cartProducts.length} ITEM{cartProducts.length === 1 ? "" : "S"} IN CART</b><small>{cartProducts.length ? `One secure checkout · ${formatUsd(cartTotal)} before applicable taxes` : "Select parts, services, or cosmetics to create one checkout."}</small></span></div><button className="primary-button" disabled={!cartProducts.length || checkoutState === "loading"} onClick={() => beginCheckout(cartProductIds)}>REQUEST PAYMENT <LockKeyhole size={15} /></button></div>

    <p className={`commerce-notice ${checkoutState === "error" ? "error" : ""}`}><LockKeyhole size={13} /> {notice}</p>
    {demoMode && <button className="demo-access-button" onClick={onDemoActivate}>DEMO MODE — UNLOCK GARAGE WITHOUT CHECKOUT</button>}
  </>;
}
