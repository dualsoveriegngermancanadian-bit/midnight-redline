// Midnight Redline game design: every tenth is explainable through power, grip, RPM, and timing.

export type RaceInput = {
  shift: boolean;
  nitro: boolean;
};

export type DragState = {
  distance: number;
  speed: number;
  rpm: number;
  gear: number;
  elapsed: number;
  reaction: number;
  launchQuality: "HOOKED" | "WHEELSPIN" | "BOGGED" | "CLEAN";
  nitro: number;
  finished: boolean;
  lastShift: "PERFECT" | "EARLY" | "LATE" | "";
};

export type RaceBuild = {
  horsepower: number;
  weight: number;
  grip: number;
  eta: number;
};

const COURSE_METRES = 402.34;
const GEAR_RATIOS = [3.06, 2.15, 1.58, 1.23, 1];

export class DragRaceSimulation {
  private readonly build: RaceBuild;
  private readonly ai: boolean;
  private elapsed = 0;
  private distance = 0;
  private speed = 0;
  private rpm = 0;
  private gear = 1;
  private started = false;
  private finished = false;
  private nitro = 1;
  private nitroTime = 0;
  private launchQuality: DragState["launchQuality"] = "CLEAN";
  private reaction = 0;
  private lastShiftAt = -2;
  private lastShift: DragState["lastShift"] = "";

  constructor(build: RaceBuild, ai = false) {
    this.build = build;
    this.ai = ai;
  }

  launch(launchRpm: number, reaction: number) {
    this.started = true;
    this.reaction = Math.max(reaction, this.ai ? 0.08 : 0.04);
    this.rpm = launchRpm;
    if (launchRpm > 6300 && this.build.grip < 0.89) this.launchQuality = "WHEELSPIN";
    else if (launchRpm < 3900) this.launchQuality = "BOGGED";
    else if (launchRpm >= 5000 && launchRpm <= 6200) this.launchQuality = "HOOKED";
    else this.launchQuality = "CLEAN";
  }

  shift() {
    if (!this.started || this.finished || this.gear >= GEAR_RATIOS.length || this.elapsed - this.lastShiftAt < 0.22) return;
    this.lastShiftAt = this.elapsed;
    if (this.rpm >= 6100 && this.rpm <= 7400) this.lastShift = "PERFECT";
    else if (this.rpm < 6100) this.lastShift = "EARLY";
    else this.lastShift = "LATE";
    const carry = this.lastShift === "PERFECT" ? 0.77 : this.lastShift === "EARLY" ? 0.66 : 0.58;
    this.gear += 1;
    this.rpm = Math.max(3400, this.rpm * carry);
    this.speed *= this.lastShift === "PERFECT" ? 0.985 : 0.95;
  }

  activateNitro() {
    if (!this.started || this.finished || this.nitro <= 0 || this.nitroTime > 0) return;
    this.nitro = 0;
    this.nitroTime = 1.6;
  }

  update(delta: number) {
    if (!this.started || this.finished) return;
    this.elapsed += delta;
    if (this.elapsed < this.reaction) return;

    if (this.ai) {
      if (this.rpm > 6900 && this.gear < GEAR_RATIOS.length) this.shift();
      if (this.distance > 190 && this.nitro > 0) this.activateNitro();
    }

    const powerMass = this.build.horsepower / this.build.weight;
    const gearFactor = GEAR_RATIOS[this.gear - 1];
    const targetSpeed = 17 + this.gear * 14.7;
    const rpmFactor = Math.min(1.2, Math.max(0.54, this.rpm / 6200));
    const speedPenalty = Math.max(0.26, 1 - this.speed / (targetSpeed * 1.25));
    let traction = this.build.grip;
    if (this.elapsed < 0.52 && this.launchQuality === "WHEELSPIN") traction *= 0.61;
    if (this.elapsed < 0.45 && this.launchQuality === "BOGGED") traction *= 0.64;
    if (this.elapsed < 0.35 && this.launchQuality === "HOOKED") traction *= 1.09;
    const nitroFactor = this.nitroTime > 0 ? 1.38 : 1;
    const shiftFactor = this.elapsed - this.lastShiftAt < 0.14 ? 0.7 : 1;
    const acceleration = (powerMass * 11.2 * gearFactor * rpmFactor * speedPenalty * traction * nitroFactor * shiftFactor) + 0.85;
    this.speed = Math.max(0, this.speed + acceleration * delta);
    this.distance += this.speed * delta;
    this.rpm = Math.min(8050, 2900 + (this.speed / targetSpeed) * 5050 + (this.gear - 1) * 110);
    this.nitroTime = Math.max(0, this.nitroTime - delta);

    if (this.distance >= COURSE_METRES) {
      this.distance = COURSE_METRES;
      this.finished = true;
    }
  }

  getState(): DragState {
    return {
      distance: this.distance,
      speed: this.speed,
      rpm: this.rpm,
      gear: this.gear,
      elapsed: this.elapsed,
      reaction: this.reaction,
      launchQuality: this.launchQuality,
      nitro: this.nitro,
      finished: this.finished,
      lastShift: this.lastShift,
    };
  }
}
