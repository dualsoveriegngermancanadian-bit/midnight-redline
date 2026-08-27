// Midnight Redline game design: tactile race states, measured performance, and clear financial telemetry.

import type { Rival, VehicleSpec } from "./raceData";

export type GameMode = "garage" | "briefing" | "staging" | "countdown" | "racing" | "results";
export type TreeState = "idle" | "staged" | "amber1" | "amber2" | "amber3" | "green" | "red";

export type RaceSnapshot = {
  mode: GameMode;
  tree: TreeState;
  message: string;
  player: {
    rpm: number;
    gear: number;
    speed: number;
    distance: number;
    elapsed: number;
    reaction: number;
    nitro: number;
    launchQuality: string;
    lastShift: string;
  };
  rival: {
    distance: number;
    elapsed: number;
    speed: number;
  };
  currentVehicle: VehicleSpec;
  rivalData: Rival;
  cash: number;
  round: number;
  unlockedRound: number;
  entry: number;
  purse: number;
  boughtUpgrades: string[];
  result?: {
    won: boolean;
    redLight: boolean;
    payout: number;
    creatorAllocation: number;
    awardedVehicle?: string;
    playerET: number;
    rivalET: number;
  };
};
