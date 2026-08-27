export type EngineState = "new" | "installed" | "cooling" | "blown" | "rebuild_required";
export type ServiceState = "idle" | "diagnosing" | "engine_swap" | "tire_service" | "dyno_check" | "race_ready";

export type EngineInventoryItem = {
  id: string;
  name: string;
  archetypes: ("modern" | "heritage" | "exotic")[];
  horsepower: number;
  reliability: number;
  state: EngineState;
  replacementProductId?: string;
};

export type TeamVehicleStatus = {
  vehicleId: string;
  engineId: string;
  serviceState: ServiceState;
  readyForRace: boolean;
  lastDynoAt?: string;
};

export type PaddockSnapshot = {
  haulerName: string;
  crewCount: number;
  vehicles: TeamVehicleStatus[];
  engines: EngineInventoryItem[];
  partsOnHand: string[];
  rivalTeamCount: number;
};

export const STARTING_ENGINE_INVENTORY: EngineInventoryItem[] = [
  { id: "havoc-stock-long-block", name: "Havoc 707 Stock Long Block", archetypes: ["modern"], horsepower: 707, reliability: 0.82, state: "installed", replacementProductId: "engine-havoc-1000-replacement" },
  { id: "spare-modern-1000", name: "Modern 1,000 HP Replacement Engine", archetypes: ["modern"], horsepower: 1000, reliability: 0.94, state: "new", replacementProductId: "engine-modern-1000-replacement" },
  { id: "spare-heritage-850", name: "Heritage 850 HP Replacement Engine", archetypes: ["heritage"], horsepower: 850, reliability: 0.91, state: "new", replacementProductId: "engine-heritage-850-replacement" },
  { id: "spare-exotic-1000", name: "Exotic 1,000 HP Replacement Engine", archetypes: ["exotic"], horsepower: 1000, reliability: 0.9, state: "new", replacementProductId: "engine-exotic-1000-replacement" },
];

export const DEFAULT_PADDOCK: PaddockSnapshot = {
  haulerName: "MIDNIGHT REDLINE // HAULER 01",
  crewCount: 6,
  vehicles: [{ vehicleId: "havoc-707", engineId: "havoc-stock-long-block", serviceState: "race_ready", readyForRace: true }],
  engines: STARTING_ENGINE_INVENTORY,
  partsOnHand: [],
  rivalTeamCount: 12,
};
