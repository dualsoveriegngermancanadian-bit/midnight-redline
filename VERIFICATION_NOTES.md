# Verification Notes

## 2026-08-27 — Commercial Interface Check

The production build loaded successfully at `/?demo` and the core Babylon race scene rendered with the HUD, race controls, timing tree, player vehicle, and rival vehicle visible. In deterministic demo mode, the simulation immediately entered the staging/countdown/race sequence. Selecting the Nitro Pass control during the active race did not open the commercial panel because the existing overlay intentionally hides all pit-sheet panels while a race is active. The next visual check must wait for a result state or use a non-demo session so the new lineup-subscription and cart panel can be reviewed.

No payment attempt was made during this verification. The server continues to require Stripe configuration before it can create a checkout session.

A fresh non-demo session successfully displayed the commercial pit-sheet after the launch gate was dismissed. The visible catalog includes all six lineup terms ($40, $45, $55, $65, $75, and $80), the $25 one-event access card, the 13-item parts/services/cosmetics catalog, cart summary, and weekly creator-payout messaging. The pit-sheet scroll container displays the entire catalogue in a constrained desktop area; the lineup cards are compact at the top of the available panel. No checkout was started, and no payment data was requested.

After the commercial-sheet layout adjustment and production-server restart, the commercial interface displayed as a dedicated scrollable pit-sheet on desktop. The visible top section includes the competitive-garage copy, six subscription cards, weekly payout language, the $25 qualifier-access card, and the start of the micro-product grid; the panel’s visible scrollbar confirms that the remainder of the catalog is accessible without clipping the game surface. The production API reported 29 catalog products, with checkout disabled and webhooks disabled because no Stripe credentials are configured.

## External Stripe References Used

- https://stripe.com/pricing — U.S. standard pricing lists domestic online card processing at 2.9% + $0.30 per successful transaction; it also lists international-card, currency-conversion, dispute, Stripe Tax, and other variable charges.
- https://stripe.com/billing/pricing — Stripe Billing pay-as-you-go pricing lists 0.7% of Billing volume and identifies recurring subscriptions, customer portal, and recovery features.
- https://docs.stripe.com/billing/quickstart — Stripe’s Checkout subscription guide requires server-side price handling and recommends a webhook endpoint before granting access.
- https://docs.stripe.com/billing/subscriptions/webhooks — Stripe’s subscription documentation confirms webhook handling is required for asynchronous status changes, payment success/failure, and access management.
- https://docs.stripe.com/connect/direct-charges — Stripe Connect direct-charge guidance was reviewed only for the alternative multi-seller marketplace model; it is not selected for the current single-creator seller model.
