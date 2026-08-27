#!/usr/bin/env bash
set -euo pipefail

# U.S. standard-pricing model used for planning only:
# Domestic card payment: 2.9% + $0.30 per successful charge.
# Stripe Billing pay-as-you-go: 0.7% of recurring billing volume.
# One-time Checkout purchases use the card-processing fee only in this model.
# Taxes, refunds, disputes, international-card surcharges, currency conversion,
# and optional Stripe Tax charges are intentionally excluded from these net figures.

card_fee() {
  echo "scale=4; $1 * 0.029 + 0.30" | bc
}

billing_fee() {
  echo "scale=4; $1 * 0.007" | bc
}

print_subscription() {
  local code="$1"
  local gross="$2"
  local card
  local billing
  local total
  local net
  local percentage

  card="$(card_fee "$gross")"
  billing="$(billing_fee "$gross")"
  total="$(echo "scale=4; $card + $billing" | bc)"
  net="$(echo "scale=4; $gross - $total" | bc)"
  percentage="$(echo "scale=2; 100 * $total / $gross" | bc)"
  printf 'SUBSCRIPTION|%s|$%s|$%s|$%s|$%s|%s%%\n' "$code" "$gross" "$card" "$billing" "$net" "$percentage"
}

print_one_time() {
  local code="$1"
  local gross="$2"
  local fee
  local net
  local percentage

  fee="$(card_fee "$gross")"
  net="$(echo "scale=4; $gross - $fee" | bc)"
  percentage="$(echo "scale=2; 100 * $fee / $gross" | bc)"
  printf 'ONE_TIME|%s|$%s|$%s|$%s|%s%%\n' "$code" "$gross" "$fee" "$net" "$percentage"
}

printf '%s\n' 'TYPE|PRODUCT|GROSS|CARD_FEE|BILLING_FEE|CREATOR_NET|FEE_PERCENT'
print_subscription 'garage_lineup_1m' 40
print_subscription 'garage_lineup_2m' 45
print_subscription 'garage_lineup_3m' 55
print_subscription 'garage_lineup_4m' 65
print_subscription 'garage_lineup_5m' 75
print_subscription 'garage_lineup_6m' 80

printf '%s\n' 'TYPE|PRODUCT|GROSS|CARD_FEE|CREATOR_NET|FEE_PERCENT'
print_one_time 'race_entry' 25
print_one_time 'micro_product_5' 5
print_one_time 'micro_product_6' 6
print_one_time 'micro_product_8' 8
print_one_time 'micro_product_10' 10
print_one_time 'micro_product_15' 15
print_one_time 'micro_product_18' 18
print_one_time 'micro_product_25' 25
print_one_time 'micro_product_35' 35
print_one_time 'micro_product_60' 60
print_one_time 'micro_product_75' 75

individual_three_five="$(echo 'scale=4; 3 * (5 * 0.029 + 0.30)' | bc)"
cart_fifteen="$(card_fee 15)"
individual_five_five="$(echo 'scale=4; 5 * (5 * 0.029 + 0.30)' | bc)"
cart_twenty_five="$(card_fee 25)"
printf 'CART_SAVINGS|3x$5 vs $15 cart|$%s|$%s|$%s\n' "$individual_three_five" "$cart_fifteen" "$(echo "scale=4; $individual_three_five - $cart_fifteen" | bc)"
printf 'CART_SAVINGS|5x$5 vs $25 cart|$%s|$%s|$%s\n' "$individual_five_five" "$cart_twenty_five" "$(echo "scale=4; $individual_five_five - $cart_twenty_five" | bc)"
