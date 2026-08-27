// Midnight Redline game design: engine builds, reaction timing, class parity, and payout clarity govern every race.

import type { Scene } from "@babylonjs/core/scene";
import { CarRig } from "./CarRig";
import { DragRaceSimulation, type RaceBuild } from "./DragRaceSimulation";
import { RIVALS, UPGRADES, getVehicle, type VehicleSpec } from "./raceData";
import { StartingTree } from "./StartingTree";
import type { GameMode, RaceSnapshot } from "./types";

type SnapshotListener = (snapshot: RaceSnapshot) => void;

export class GameWorld {
  private readonly playerRig: CarRig;
  private readonly rivalRig: CarRig;
  private readonly tree: StartingTree;
  private readonly demo: boolean;
  private listener: SnapshotListener | null = null;
  private mode: GameMode = "garage";
  private cash = 65000;
  private round = 0;
  private unlockedRound = 0;
  private currentVehicleId = "havoc-707";
  private ownedVehicleIds: string[] = [];
  private boughtUpgrades: string[] = [];
  private playerSim: DragRaceSimulation | null = null;
  private rivalSim: DragRaceSimulation | null = null;
  private throttle = false;
  private stagingRpm = 2600;
  private countdown = 0;
  private greenAt = 0;
  private result: RaceSnapshot["result"];
  private message = "Select your car. Build the motor. Own the tree.";
  private demoTimer = 0;
  private demoStarted = false;
  private hudTick = 0;
  private pinkSlip = false;
  /**
   * Production access can only be granted by a server-side verified bank-payment confirmation.
   * The local demo flag remains available solely for deterministic visual testing.
   */
  private verifiedLineupAccess = false;
  private lineupCoveredThrough: string | null = null;
  private verifiedRaceEntry = false;

  constructor(scene: Scene) {
    const vehicle = getVehicle(this.currentVehicleId);
    this.playerRig = new CarRig(scene, vehicle, -2.5);
    this.rivalRig = new CarRig(scene, { ...vehicle, id: "nova-rig", color: "#e8e4d9", accent: "#e44324" }, 2.5);
    this.tree = new StartingTree(scene);
    this.demo = new URLSearchParams(window.location.search).has("demo");
  }

  subscribe(listener: SnapshotListener) {
    this.listener = listener;
    listener(this.snapshot());
    return () => { if (this.listener === listener) this.listener = null; };
  }

  private emit() { this.listener?.(this.snapshot()); }

  private currentVehicle(): VehicleSpec { return getVehicle(this.currentVehicleId); }

  private playerBuild(): RaceBuild {
    const vehicle = this.currentVehicle();
    return this.boughtUpgrades.reduce<RaceBuild>((build, upgradeId) => {
      const upgrade = UPGRADES.find((item) => item.id === upgradeId);
      if (!upgrade) return build;
      return {
        horsepower: build.horsepower + (upgrade.horsepower ?? 0),
        weight: build.weight + (upgrade.weight ?? 0),
        grip: build.grip + (upgrade.grip ?? 0),
        eta: build.eta,
      };
    }, { horsepower: vehicle.horsepower, weight: vehicle.weight, grip: vehicle.grip, eta: vehicle.eta });
  }

  private snapshot(): RaceSnapshot {
    const player = this.playerSim?.getState() ?? { rpm: this.stagingRpm, gear: 1, speed: 0, distance: 0, elapsed: 0, reaction: 0, nitro: 1, launchQuality: "—", lastShift: "" };
    const rival = this.rivalSim?.getState() ?? { rpm: 0, gear: 1, speed: 0, distance: 0, elapsed: 0, reaction: 0, nitro: 1, launchQuality: "—", lastShift: "" };
    const rivalData = RIVALS[this.pinkSlip ? 0 : this.round];
    return {
      mode: this.mode,
      tree: this.tree.getState(),
      message: this.message,
      player: { rpm: player.rpm, gear: player.gear, speed: player.speed, distance: player.distance, elapsed: player.elapsed, reaction: player.reaction, nitro: player.nitro, launchQuality: player.launchQuality, lastShift: player.lastShift },
      rival: { distance: rival.distance, elapsed: rival.elapsed, speed: rival.speed },
      currentVehicle: this.currentVehicle(),
      rivalData,
      cash: this.cash,
      round: this.round,
      unlockedRound: this.unlockedRound,
      entry: this.pinkSlip ? 750 : rivalData.buyIn,
      purse: this.pinkSlip ? 0 : rivalData.purse,
      boughtUpgrades: this.boughtUpgrades,
      result: this.result,
    };
  }

  setMode(mode: GameMode) {
    if (this.mode === "racing" || this.mode === "countdown" || this.mode === "staging") return;
    this.mode = mode;
    this.message = mode === "garage" ? "Tune the setup. The event stays open." : RIVALS[this.round].briefing;
    this.emit();
  }

  selectRound(round: number) {
    if (round > this.unlockedRound || this.mode === "racing") return;
    this.round = round;
    this.mode = "briefing";
    this.message = RIVALS[this.round].briefing;
    this.emit();
  }

  purchaseVehicle(id: string) {
    if (this.mode === "racing" || this.mode === "countdown" || this.mode === "staging") return;
    const vehicle = getVehicle(id);
    if (!this.ownedVehicleIds.includes(id)) {
      if (this.cash < vehicle.price) { this.message = "INSUFFICIENT CASH BALANCE FOR THIS BUILD."; this.emit(); return; }
      this.cash -= vehicle.price;
      this.ownedVehicleIds.push(id);
      this.message = `${vehicle.name.toUpperCase()} ADDED TO YOUR GARAGE.`;
    }
    this.currentVehicleId = id;
    this.message = `${vehicle.name.toUpperCase()} IS SET AT THE LINE.`;
    this.emit();
  }

  purchaseUpgrade(id: string) {
    if (this.boughtUpgrades.includes(id)) { this.message = "UPGRADE ALREADY INSTALLED."; this.emit(); return; }
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (!upgrade) { this.message = "PART NOT FOUND IN THE VALIDATED CATALOG."; this.emit(); return; }
    if (!upgrade.compatible.includes(this.currentVehicle().archetype)) { this.message = "PART NOT COMPATIBLE WITH THIS VEHICLE ARCHETYPE."; this.emit(); return; }
    if (this.cash < upgrade.price) { this.message = "INSUFFICIENT CASH BALANCE."; this.emit(); return; }
    this.cash -= upgrade.price;
    this.boughtUpgrades.push(id);
    this.message = `${upgrade.name.toUpperCase()} INSTALLED.`;
    this.emit();
  }

  private hasActiveLineupAccess() {
    if (!this.verifiedLineupAccess) return false;
    if (!this.lineupCoveredThrough) return true;
    return Date.parse(this.lineupCoveredThrough) > Date.now();
  }

  beginRace(pinkSlip = false) {
    if (this.mode === "racing" || this.mode === "countdown" || this.mode === "staging") return;
    if (!this.demo && !this.hasActiveLineupAccess()) {
      this.message = "ACTIVE LINEUP SUBSCRIPTION REQUIRED. COMPLETE VERIFIED CHECKOUT TO ENTER THE GARAGE.";
      this.emit();
      return;
    }
    if (!this.demo && !this.verifiedRaceEntry) {
      this.message = "VERIFIED $25 QUALIFIER ENTRY REQUIRED. ADD EVENT ACCESS THROUGH THE PAID GARAGE.";
      this.emit();
      return;
    }
    const rival = RIVALS[pinkSlip ? 0 : this.round];
    const buyIn = pinkSlip ? 750 : rival.buyIn;
    if (this.cash < buyIn) { this.message = "BUY-IN NOT COVERED. RETURN TO THE GARAGE."; this.emit(); return; }
    this.pinkSlip = pinkSlip;
    if (!this.demo) this.verifiedRaceEntry = false;
    this.cash -= buyIn;
    this.result = undefined;
    this.playerSim = new DragRaceSimulation(this.playerBuild());
    this.rivalSim = new DragRaceSimulation({ horsepower: this.demo ? Math.round(rival.horsepower * 0.84) : rival.horsepower, weight: rival.weight, grip: rival.grip, eta: rival.eta }, true);
    this.playerRig.reset();
    this.rivalRig.reset();
    this.mode = "staging";
    this.stagingRpm = 2900;
    this.tree.setState("staged");
    this.message = pinkSlip ? "PINK SLIP STAGED. BEAT NOVA AND CLAIM THE NOVA 8." : "STAGED. HOLD [SPACE] TO BRING UP RPM. PRESS [S] TO ARM THE TREE.";
    this.emit();
  }

  /**
   * Future server integration calls this only after verifying the bank-payment confirmation data
   * and loading the entitlement record for the authenticated player.
   */
  applyVerifiedCommerceEntitlements({ lineupActive, raceEntryActive, lineupCoveredThrough = null }: { lineupActive: boolean; raceEntryActive: boolean; lineupCoveredThrough?: string | null }) {
    if (this.demo) return;
    this.verifiedLineupAccess = lineupActive;
    this.lineupCoveredThrough = lineupCoveredThrough;
    this.verifiedRaceEntry = raceEntryActive;
    this.message = this.hasActiveLineupAccess()
      ? raceEntryActive ? `VERIFIED LINEUP READY THROUGH ${new Date(lineupCoveredThrough ?? Date.now()).toLocaleDateString()}.` : "LINEUP VERIFIED. ADD A $25 QUALIFIER ENTRY TO RACE."
      : "ACTIVE LINEUP SUBSCRIPTION REQUIRED OR RENEWAL NEEDED.";
    this.emit();
  }

  armTree() {
    if (this.mode !== "staging") return;
    this.mode = "countdown";
    this.countdown = 0;
    this.tree.setState("staged");
    this.message = "TREE ARMED. DO NOT JUMP THE GREEN.";
    this.emit();
  }

  setThrottle(active: boolean) {
    this.throttle = active;
    if (this.mode === "racing" || this.mode === "staging") this.emit();
  }

  shift() {
    if (this.mode === "countdown") { this.redLight(); return; }
    if (this.mode !== "racing") return;
    this.playerSim?.shift();
    this.emit();
  }

  useNitro() {
    if (this.mode !== "racing") return;
    this.playerSim?.activateNitro();
    this.message = "NITRO SHOT ARMED.";
    this.emit();
  }

  private launch() {
    if (!this.playerSim || !this.rivalSim || this.mode !== "countdown") return;
    this.greenAt = this.countdown;
    this.playerSim.launch(this.stagingRpm, 0.04);
    this.rivalSim.launch(5700, 0.16 + this.round * 0.012);
    this.playerRig.pulseLaunch();
    this.rivalRig.pulseLaunch();
    this.mode = "racing";
    this.tree.setState("green");
    this.message = "GREEN. SHIFT BETWEEN 6,100 AND 7,400 RPM.";
    this.emit();
  }

  private redLight() {
    this.tree.setState("red");
    this.mode = "results";
    const rival = RIVALS[this.pinkSlip ? 0 : this.round];
    this.result = { won: false, redLight: true, payout: 0, creatorAllocation: Math.round(rival.purse * 0.14), playerET: 0, rivalET: rival.eta };
    this.message = "RED LIGHT. THE TREE DOES NOT NEGOTIATE.";
    this.emit();
  }

  private resolveRace() {
    if (!this.playerSim || !this.rivalSim || this.mode !== "racing") return;
    const player = this.playerSim.getState();
    const rival = this.rivalSim.getState();
    if (!player.finished || !rival.finished) return;
    const event = RIVALS[this.pinkSlip ? 0 : this.round];
    const won = player.elapsed < rival.elapsed;
    const creatorAllocation = this.pinkSlip ? 0 : Math.round(event.purse * 0.14);
    const payout = this.pinkSlip ? 0 : won ? event.purse - creatorAllocation : 0;
    const awardedVehicle = this.pinkSlip && won ? "Nova 8" : undefined;
    if (won) {
      this.cash += payout;
      this.unlockedRound = Math.min(RIVALS.length - 1, Math.max(this.unlockedRound, this.round + 1));
      if (this.pinkSlip && !this.ownedVehicleIds.includes("nova-8")) this.ownedVehicleIds.push("nova-8");
    }
    this.mode = "results";
    this.tree.setState(won ? "green" : "red");
    this.result = { won, redLight: false, payout, creatorAllocation, awardedVehicle, playerET: player.elapsed, rivalET: rival.elapsed };
    this.message = won ? this.pinkSlip ? "PINK SLIP WON. NOVA 8 TRANSFERRED TO YOUR GARAGE." : "WIN SLIP PRINTED. NEXT EVENT UNLOCKED." : "RIVAL TAKES THE SLIP. RETUNE AND RUN IT BACK.";
    this.emit();
  }

  update(delta: number) {
    if (this.demo) this.demoTimer += delta;
    this.hudTick += delta;
    if (this.demo && !this.demoStarted) {
      if (this.demoTimer > 0.7) { this.demoStarted = true; this.beginRace(); }
    }
    if (this.mode === "staging") {
      const target = this.throttle || this.demo ? 5750 : 2900;
      this.stagingRpm += (target - this.stagingRpm) * Math.min(1, delta * 4.5);
      if (this.demo && this.demoTimer > 1.6) this.armTree();
    }
    if (this.mode === "countdown") {
      this.countdown += delta;
      if (this.countdown < 0.75) this.tree.setState("staged");
      else if (this.countdown < 1.35) this.tree.setState("amber1");
      else if (this.countdown < 1.95) this.tree.setState("amber2");
      else if (this.countdown < 2.55) this.tree.setState("amber3");
      else this.launch();
      if (this.demo) this.throttle = true;
    }
    if (this.mode === "racing" && this.playerSim && this.rivalSim) {
      this.playerSim.update(delta);
      this.rivalSim.update(delta);
      const player = this.playerSim.getState();
      const rival = this.rivalSim.getState();
      if (this.demo && player.gear < 5 && player.rpm > 6850) this.playerSim.shift();
      if (this.demo && player.distance > 175 && player.nitro > 0) this.playerSim.activateNitro();
      this.playerRig.update(player.distance, player.speed, player.rpm, delta, true);
      this.rivalRig.update(rival.distance, rival.speed, rival.rpm, delta, true);
      this.resolveRace();
    }
    if (this.hudTick > 0.09 && (this.mode === "staging" || this.mode === "countdown" || this.mode === "racing")) {
      this.hudTick = 0;
      this.emit();
    }
  }
}
