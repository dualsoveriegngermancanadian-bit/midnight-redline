# Verification Notes

## 2026-08-27 — Commercial Interface and RBC Payment Boundary

The production build loaded successfully at `/?demo` and the core Babylon race scene rendered with the HUD, race controls, timing tree, player vehicle, and rival vehicle visible. The commercial pit-sheet displays the six lineup terms ($40, $45, $55, $65, $75, and $80), the $25 one-event access card, the 13-item parts/services/cosmetics catalog, the cart summary, and weekly creator-settlement messaging. The pit-sheet uses a constrained scrollable layout so the complete catalog remains accessible without clipping the race surface.

The approved payment path is RBC business e-transfer. The client sends a server-validated catalog selection to the RBC business-payment request boundary. The server creates a unique order reference and records the CAD amount with `awaiting_bank_confirmation` status. No paid access is granted from a button click, a browser redirect, a screenshot, or an unverified customer claim.

The server supports controlled reconciliation outcomes of `confirmed`, `expired`, `refunded`, and `renewal_required`. A confirmed bank transaction must match the order amount and may be reconciled only once. The reconciliation boundary is protected by a server-side secret and is disabled until RBC business-payment enrollment and a verified bank confirmation or reconciliation adapter are configured.

No banking credentials, account numbers, security answers, identity documents, or tax identifiers are stored in the game or repository. The customer-facing handoff may use email or phone delivery, while the customer authorizes the payment in their own banking environment. Weekly creator settlement is recorded as the approved cadence; player award and prize disbursements remain separate from ordinary catalog revenue.

## Verification status

`pnpm check` and `pnpm build` pass after the RBC-only payment boundary and catalog changes. The working project remains non-live until the creator’s RBC business-payment service is enrolled and the production confirmation adapter is configured. No customer payment was collected during testing.

## Official bank references

1. [RBC — Receive Payments from Customers and Others](https://www.rbcroyalbank.com/business/paying-and-receiving/receive-payments.html) — describes business Interac e-Transfer Request Money, invoice references, and business receiving options.
2. [RBC — Business Banking APIs](https://www.rbcroyalbank.com/business/api/index.html) — describes RBC business API capabilities and directs businesses to their RBC advisor for enrollment and availability.
3. [Scotiabank — Interac e-Transfer for business](https://www.scotiabank.com/ca/en/business-banking/banking-solutions/payments-and-merchant-services/interac-e-transfer-for-business.html) — retained as a non-primary alternative reference only.
