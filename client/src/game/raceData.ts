// Midnight Redline game design: precision timing, engine credibility, and reserved vermilion performance cues.

export type VehicleClass = "Street 10.5" | "Modern Muscle" | "Heritage Pro" | "Exotic X";

export type VehicleSpec = {
  id: string;
  name: string;
  tag: string;
  className: VehicleClass;
  archetype: "modern" | "heritage" | "exotic";
  horsepower: number;
  weight: number;
  grip: number;
  price: number;
  eta: number;
  color: string;
  accent: string;
  description: string;
};

export type Upgrade = {
  id: string;
  name: string;
  category: string;
  price: number;
  compatible: VehicleSpec["archetype"][];
  horsepower?: number;
  weight?: number;
  grip?: number;
  detail: string;
};

export type Rival = {
  name: string;
  handle: string;
  vehicle: string;
  className: VehicleClass;
  horsepower: number;
  weight: number;
  grip: number;
  eta: number;
  purse: number;
  buyIn: number;
  briefing: string;
};

export const VEHICLES: VehicleSpec[] = [
  {
    id: "havoc-707",
    name: "Havoc 707",
    tag: "MODERN MUSCLE",
    className: "Modern Muscle",
    archetype: "modern",
    horsepower: 707,
    weight: 1960,
    grip: 0.84,
    price: 42000,
    eta: 10.88,
    color: "#171b23",
    accent: "#e44324",
    description: "Supercharged torque; built to make the launch loud.",
  },
  {
    id: "c8-vortex",
    name: "C8 Vortex",
    tag: "MID-ENGINE SPORT",
    className: "Street 10.5",
    archetype: "modern",
    horsepower: 670,
    weight: 1530,
    grip: 0.9,
    price: 78000,
    eta: 10.64,
    color: "#f0eee7",
    accent: "#cc321d",
    description: "Sharp response and high rear grip through every shift.",
  },
  {
    id: "zl-track",
    name: "ZL Track",
    tag: "MODERN MUSCLE",
    className: "Modern Muscle",
    archetype: "modern",
    horsepower: 650,
    weight: 1690,
    grip: 0.86,
    price: 51000,
    eta: 10.92,
    color: "#d8a62f",
    accent: "#151515",
    description: "A low, hard-edged coupe with a forgiving shift window.",
  },
  {
    id: "iron-charger",
    name: "Iron Charger",
    tag: "HERITAGE PRO",
    className: "Heritage Pro",
    archetype: "heritage",
    horsepower: 620,
    weight: 1840,
    grip: 0.78,
    price: 36000,
    eta: 11.42,
    color: "#263d62",
    accent: "#f4ede0",
    description: "Long wheelbase, big-block authority, and a serious top end.",
  },
  {
    id: "chevelle-ssr",
    name: "Chevelle SSR",
    tag: "HERITAGE PRO",
    className: "Heritage Pro",
    archetype: "heritage",
    horsepower: 590,
    weight: 1725,
    grip: 0.8,
    price: 33000,
    eta: 11.55,
    color: "#7e2428",
    accent: "#f0d6ad",
    description: "A compact classic body that rewards deliberate gearing.",
  },
  {
    id: "nova-8",
    name: "Nova 8",
    tag: "HERITAGE PRO",
    className: "Heritage Pro",
    archetype: "heritage",
    horsepower: 560,
    weight: 1490,
    grip: 0.82,
    price: 27500,
    eta: 11.33,
    color: "#d7d3c9",
    accent: "#e44324",
    description: "Lightweight, analogue, and fast enough to embarrass newer metal.",
  },
  {
    id: "firebird-ram",
    name: "Firebird Ram",
    tag: "HERITAGE PRO",
    className: "Heritage Pro",
    archetype: "heritage",
    horsepower: 575,
    weight: 1570,
    grip: 0.81,
    price: 29000,
    eta: 11.38,
    color: "#a44925",
    accent: "#151515",
    description: "Front-engine attitude with enough grip for the full eighth.",
  },
  {
    id: "avento-r", 
    name: "Avento R",
    tag: "EXOTIC X",
    className: "Exotic X",
    archetype: "exotic",
    horsepower: 770,
    weight: 1520,
    grip: 0.92,
    price: 145000,
    eta: 10.31,
    color: "#629e41",
    accent: "#0f1712",
    description: "All-wheel precision, an unforgiving launch, and huge trap speed.",
  },
  {
    id: "monza-v12",
    name: "Monza V12",
    tag: "EXOTIC X",
    className: "Exotic X",
    archetype: "exotic",
    horsepower: 789,
    weight: 1470,
    grip: 0.91,
    price: 165000,
    eta: 10.25,
    color: "#d53d25",
    accent: "#f0e5c9",
    description: "A high-revving final-round weapon with a narrow perfect shift.",
  },
];

export const UPGRADES: Upgrade[] = [
  { id: "street-tune", name: "Dyno Street Tune", category: "CALIBRATION", price: 6, compatible: ["modern", "heritage", "exotic"], horsepower: 22, detail: "+22 hp · ignition and fuel map" },
  { id: "ecu", name: "ECU Flash", category: "CALIBRATION", price: 15, compatible: ["modern", "exotic"], horsepower: 45, detail: "+45 hp · sharpened ignition map" },
  { id: "radials", name: "10.5 Drag Radials", category: "CONTACT", price: 10, compatible: ["modern", "heritage", "exotic"], grip: 0.055, detail: "+5.5% grip · cleaner launch" },
  { id: "carbs", name: "4-Barrel Carb Kit", category: "FUELLING", price: 15, compatible: ["heritage"], horsepower: 38, detail: "+38 hp · mechanical fuel delivery" },
  { id: "nitrous", name: "Wet Nitrous Kit", category: "BOOST", price: 25, compatible: ["modern", "heritage", "exotic"], horsepower: 70, detail: "+70 hp · one 1.6s shot" },
  { id: "short-trans", name: "Short-Ratio Transmission", category: "DRIVELINE", price: 35, compatible: ["modern", "heritage"], horsepower: 12, grip: 0.018, detail: "+12 hp · tighter gear recovery" },
  { id: "rear-end", name: "4.10 Rear End", category: "FINAL DRIVE", price: 75, compatible: ["modern", "heritage"], horsepower: 16, grip: 0.02, detail: "+16 hp · launch-biased final drive" },
  { id: "weight", name: "Weight Relief", category: "CHASSIS", price: 60, compatible: ["modern", "heritage", "exotic"], weight: -120, detail: "−120 kg · stronger acceleration" },
  { id: "roots-blower", name: "Roots Supercharger", category: "FORCED INDUCTION", price: 35, compatible: ["modern", "heritage"], horsepower: 95, grip: 0.015, detail: "+95 hp · immediate torque rise" },
  { id: "turbo", name: "Twin-Scroll Turbo", category: "FORCED INDUCTION", price: 35, compatible: ["modern", "exotic"], horsepower: 110, detail: "+110 hp · elevated top-end" },
  { id: "exhaust", name: "Free-Flow Exhaust", category: "EXHAUST", price: 18, compatible: ["modern", "heritage", "exotic"], horsepower: 14, detail: "+14 hp · less restriction" },
  { id: "wheel-pack", name: "Forged Wheel Package", category: "WHEELS", price: 8, compatible: ["modern", "heritage", "exotic"], detail: "visual fitment · rotating mass look" },
  { id: "night-paint", name: "Midnight Paint Finish", category: "FINISH", price: 5, compatible: ["modern", "heritage", "exotic"], detail: "visual finish · black cherry clearcoat" },
];

export const RIVALS: Rival[] = [
  { name: "Nova Reyes", handle: "NOVA", vehicle: "Pearl Apex", className: "Street 10.5", horsepower: 590, weight: 1480, grip: 0.88, eta: 11.22, purse: 1250, buyIn: 250, briefing: "She leaves clean. Keep your launch below the spin line and let the car pull." },
  { name: "Kade Morgan", handle: "SWITCH", vehicle: "Nightline Z", className: "Street 10.5", horsepower: 648, weight: 1515, grip: 0.86, eta: 10.94, purse: 1900, buyIn: 400, briefing: "Kade lives on reaction time. Beat the tree, not the noise." },
  { name: "Marisol Vex", handle: "VEX", vehicle: "Blue Current", className: "Modern Muscle", horsepower: 690, weight: 1700, grip: 0.85, eta: 10.82, purse: 2850, buyIn: 650, briefing: "The lane is damp. Grip and timing will matter more than raw horsepower." },
  { name: "Bishop Crane", handle: "BISHOP", vehicle: "Black Tax", className: "Modern Muscle", horsepower: 750, weight: 1840, grip: 0.83, eta: 10.64, purse: 4100, buyIn: 900, briefing: "Big torque. Carry your second gear cleanly or he will own the middle." },
  { name: "Torque Watan", handle: "TORQUE", vehicle: "Freightline", className: "Exotic X", horsepower: 785, weight: 1550, grip: 0.91, eta: 10.31, purse: 5900, buyIn: 1250, briefing: "The final eighth is his territory. Save nitro for the pull." },
  { name: "The Host", handle: "THE ARCHITECT", vehicle: "Blackout C8 / 1000", className: "Exotic X", horsepower: 1000, weight: 1495, grip: 0.94, eta: 9.36, purse: 15000, buyIn: 2500, briefing: "Black-on-black. Supercharged. A thousand horsepower under a hood scoop. Finish the circuit, then beat the host." },
];

export function getVehicle(id: string) {
  return VEHICLES.find((vehicle) => vehicle.id === id) ?? VEHICLES[0];
}

export function performanceClass(vehicle: Pick<VehicleSpec, "horsepower" | "weight" | "eta">) {
  const powerToWeight = vehicle.horsepower / vehicle.weight;
  if (powerToWeight > 0.47 || vehicle.eta < 10.5) return "X / 10.4";
  if (powerToWeight > 0.39 || vehicle.eta < 11) return "A / 10.9";
  return "B / 11.5";
}

export const CITY_CIRCUIT = [
  ["Harborline", "MIDNIGHT", "Industrial waterfront"], ["Eastbridge", "DUSK", "Old viaduct"], ["Mesa Vale", "DAY", "Desert access road"], ["Crown City", "MIDNIGHT", "Financial district"],
  ["Bayhaven", "NIGHT", "Container terminal"], ["Ridgeway", "DAY", "Canyon two-lane"], ["Saint Vale", "NIGHT", "Warehouse grid"], ["Pinegate", "DUSK", "Logging road"],
  ["Westport", "NIGHT", "Back-alley docklands"], ["Ironwood", "DAY", "Fairground strip"], ["Lake City", "NIGHT", "Tunnel expressway"], ["Granite", "DUSK", "Quarry loop"],
  ["Silverline", "NIGHT", "Rail depot"], ["Cedar Falls", "DAY", "County airfield"], ["Northstar", "MIDNIGHT", "Frozen industrial"], ["Solano", "DUSK", "Coastal bypass"],
  ["Portlandia", "NIGHT", "Bridge lower deck"], ["Sable", "DAY", "Salt flat service lane"], ["Hallow", "NIGHT", "Neon market alleys"], ["Crescent", "DUSK", "Riverside mills"],
  ["Glenwood", "DAY", "Mountain staging area"], ["New Carson", "NIGHT", "Freight intermodal"], ["Ravenna", "MIDNIGHT", "Night port"], ["Lowell", "DUSK", "Factory row"],
  ["Cinder", "NIGHT", "Refinery edge"], ["Bellweather", "DAY", "Fairground asphalt"], ["Aster", "NIGHT", "Hotel service road"], ["Crosswind", "DUSK", "Wind farm access"],
  ["Blackwater", "MIDNIGHT", "Dam spillway"], ["Wellington", "DAY", "Boulevard sprint"], ["Redstone", "NIGHT", "Canyon underpass"], ["Midnight Redline", "MIDNIGHT", "Final zero-day circuit"],
] as const;
