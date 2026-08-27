export type BillingMode = "subscription" | "payment";
export type CommerceCategory = "lineup" | "race_entry" | "vehicle" | "part" | "service" | "cosmetic";

export type CommerceProduct = {
  id: string;
  lookupKey: string;
  name: string;
  description: string;
  category: CommerceCategory;
  billingMode: BillingMode;
  /** Displayed price in cents. `null` means the price must be configured in the approved business payment system before launch. */
  amountCents: number | null;
  /** Number of calendar months between subscription renewals. */
  intervalMonths?: number;
  requiresActiveLineup?: boolean;
  sourceGameValue?: number;
};

export const LINEUP_SUBSCRIPTIONS: CommerceProduct[] = [
  { id: "garage-lineup-1m", lookupKey: "garage_lineup_1m", name: "Garage Lineup — 1 Month", description: "One month of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 4000, intervalMonths: 1 },
  { id: "garage-lineup-2m", lookupKey: "garage_lineup_2m", name: "Garage Lineup — 2 Months", description: "Two months of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 4500, intervalMonths: 2 },
  { id: "garage-lineup-3m", lookupKey: "garage_lineup_3m", name: "Garage Lineup — 3 Months", description: "Three months of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 5500, intervalMonths: 3 },
  { id: "garage-lineup-4m", lookupKey: "garage_lineup_4m", name: "Garage Lineup — 4 Months", description: "Four months of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 6500, intervalMonths: 4 },
  { id: "garage-lineup-5m", lookupKey: "garage_lineup_5m", name: "Garage Lineup — 5 Months", description: "Five months of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 7500, intervalMonths: 5 },
  { id: "garage-lineup-6m", lookupKey: "garage_lineup_6m", name: "Garage Lineup — 6 Months", description: "Six months of active rental-lineup, garage, dyno, qualifier, and host-progression access.", category: "lineup", billingMode: "subscription", amountCents: 8000, intervalMonths: 6 },
];

export const RACE_ACCESS_PRODUCTS: CommerceProduct[] = [
  { id: "race-entry", lookupKey: "race_entry", name: "Qualifier Race Entry", description: "One paid entry to an eligible Midnight Redline qualifier for an active lineup subscriber.", category: "race_entry", billingMode: "payment", amountCents: 2500, requiresActiveLineup: true },
];

export const VEHICLE_PRODUCTS: CommerceProduct[] = [
  { id: "vehicle-havoc-707", lookupKey: "vehicle_havoc_707", name: "Havoc 707 — Permanent Garage Unlock", description: "Permanent in-game unlock for the Havoc 707.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 42000 },
  { id: "vehicle-c8-vortex", lookupKey: "vehicle_c8_vortex", name: "C8 Vortex — Permanent Garage Unlock", description: "Permanent in-game unlock for the C8 Vortex.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 78000 },
  { id: "vehicle-zl-track", lookupKey: "vehicle_zl_track", name: "ZL Track — Permanent Garage Unlock", description: "Permanent in-game unlock for the ZL Track.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 51000 },
  { id: "vehicle-iron-charger", lookupKey: "vehicle_iron_charger", name: "Iron Charger — Permanent Garage Unlock", description: "Permanent in-game unlock for the Iron Charger.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 36000 },
  { id: "vehicle-chevelle-ssr", lookupKey: "vehicle_chevelle_ssr", name: "Chevelle SSR — Permanent Garage Unlock", description: "Permanent in-game unlock for the Chevelle SSR.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 33000 },
  { id: "vehicle-nova-8", lookupKey: "vehicle_nova_8", name: "Nova 8 — Permanent Garage Unlock", description: "Permanent in-game unlock for the Nova 8.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 27500 },
  { id: "vehicle-firebird-ram", lookupKey: "vehicle_firebird_ram", name: "Firebird Ram — Permanent Garage Unlock", description: "Permanent in-game unlock for the Firebird Ram.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 29000 },
  { id: "vehicle-avento-r", lookupKey: "vehicle_avento_r", name: "Avento R — Permanent Garage Unlock", description: "Permanent in-game unlock for the Avento R.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 145000 },
  { id: "vehicle-monza-v12", lookupKey: "vehicle_monza_v12", name: "Monza V12 — Permanent Garage Unlock", description: "Permanent in-game unlock for the Monza V12.", category: "vehicle", billingMode: "payment", amountCents: null, sourceGameValue: 165000 },
];

export const GARAGE_MICRO_PRODUCTS: CommerceProduct[] = [
  { id: "street-tune", lookupKey: "service_dyno_street_tune", name: "Dyno Street Tune", description: "One-time calibration service.", category: "service", billingMode: "payment", amountCents: 600, requiresActiveLineup: true, sourceGameValue: 6 },
  { id: "ecu", lookupKey: "service_ecu_flash", name: "ECU Flash", description: "One-time calibration service.", category: "service", billingMode: "payment", amountCents: 1500, requiresActiveLineup: true, sourceGameValue: 15 },
  { id: "radials", lookupKey: "part_10_5_drag_radials", name: "10.5 Drag Radials", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 1000, requiresActiveLineup: true, sourceGameValue: 10 },
  { id: "carbs", lookupKey: "part_4_barrel_carb_kit", name: "4-Barrel Carb Kit", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 1500, requiresActiveLineup: true, sourceGameValue: 15 },
  { id: "nitrous", lookupKey: "part_wet_nitrous_kit", name: "Wet Nitrous Kit", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 2500, requiresActiveLineup: true, sourceGameValue: 25 },
  { id: "short-trans", lookupKey: "part_short_ratio_transmission", name: "Short-Ratio Transmission", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 3500, requiresActiveLineup: true, sourceGameValue: 35 },
  { id: "rear-end", lookupKey: "part_4_10_rear_end", name: "4.10 Rear End", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 7500, requiresActiveLineup: true, sourceGameValue: 75 },
  { id: "weight", lookupKey: "service_weight_relief", name: "Weight Relief", description: "One-time chassis service.", category: "service", billingMode: "payment", amountCents: 6000, requiresActiveLineup: true, sourceGameValue: 60 },
  { id: "roots-blower", lookupKey: "part_roots_supercharger", name: "Roots Supercharger", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 3500, requiresActiveLineup: true, sourceGameValue: 35 },
  { id: "turbo", lookupKey: "part_twin_scroll_turbo", name: "Twin-Scroll Turbo", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 3500, requiresActiveLineup: true, sourceGameValue: 35 },
  { id: "exhaust", lookupKey: "part_free_flow_exhaust", name: "Free-Flow Exhaust", description: "One-time performance part.", category: "part", billingMode: "payment", amountCents: 1800, requiresActiveLineup: true, sourceGameValue: 18 },
  { id: "wheel-pack", lookupKey: "part_forged_wheel_package", name: "Forged Wheel Package", description: "One-time wheel package.", category: "cosmetic", billingMode: "payment", amountCents: 800, requiresActiveLineup: true, sourceGameValue: 8 },
  { id: "night-paint", lookupKey: "service_midnight_paint_finish", name: "Midnight Paint Finish", description: "One-time cosmetic finish.", category: "cosmetic", billingMode: "payment", amountCents: 500, requiresActiveLineup: true, sourceGameValue: 5 },
];

export const COMMERCE_PRODUCTS: CommerceProduct[] = [
  ...LINEUP_SUBSCRIPTIONS,
  ...RACE_ACCESS_PRODUCTS,
  ...VEHICLE_PRODUCTS,
  ...GARAGE_MICRO_PRODUCTS,
];

export const COMMERCE_PRODUCTS_BY_ID = new Map(COMMERCE_PRODUCTS.map((product) => [product.id, product]));

export function findCommerceProducts(ids: string[]): CommerceProduct[] | null {
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length === 0 || uniqueIds.length > 20) return null;
  const products = uniqueIds.map((id) => COMMERCE_PRODUCTS_BY_ID.get(id));
  return products.every((product): product is CommerceProduct => Boolean(product)) ? products : null;
}

export function isValidCheckoutCart(products: CommerceProduct[]) {
  const containsSubscription = products.some((product) => product.billingMode === "subscription");
  return !containsSubscription || (products.length === 1 && products[0].category === "lineup");
}

export function formatUsd(cents: number | null) {
  return cents === null ? "PRICE PENDING" : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}
