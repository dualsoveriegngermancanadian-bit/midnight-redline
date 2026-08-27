// Midnight Redline game design: low, functional car silhouettes with visible squat, wheel roll, and exhaust heat.

import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { VehicleSpec } from "./raceData";

export class CarRig {
  readonly root: TransformNode;
  private readonly wheels: TransformNode[] = [];
  private readonly exhaust: StandardMaterial;
  private launchPulse = 0;

  constructor(scene: Scene, vehicle: VehicleSpec, laneZ: number) {
    this.root = new TransformNode(`${vehicle.id}-rig`, scene);
    this.root.position = new Vector3(-154, 0.58, laneZ);

    const paint = new StandardMaterial(`${vehicle.id}-paint`, scene);
    paint.diffuseColor = Color3.FromHexString(vehicle.color);
    paint.specularColor = new Color3(0.42, 0.42, 0.42);

    const glass = new StandardMaterial(`${vehicle.id}-glass`, scene);
    glass.diffuseColor = Color3.FromHexString("#111822");
    glass.specularColor = Color3.FromHexString("#d0e3ef");

    const trim = new StandardMaterial(`${vehicle.id}-trim`, scene);
    trim.diffuseColor = Color3.FromHexString(vehicle.accent);
    trim.specularColor = Color3.FromHexString("#f0dfc0");

    const tyre = new StandardMaterial(`${vehicle.id}-tyre`, scene);
    tyre.diffuseColor = Color3.FromHexString("#0c0f13");

    this.exhaust = new StandardMaterial(`${vehicle.id}-exhaust`, scene);
    this.exhaust.diffuseColor = Color3.FromHexString("#25100b");
    this.exhaust.emissiveColor = Color3.FromHexString("#160403");

    const body = MeshBuilder.CreateBox(`${vehicle.id}-body`, { width: 5.05, height: 0.72, depth: 2.02 }, scene);
    body.parent = this.root;
    body.position.y = 0.42;
    body.material = paint;

    const hood = MeshBuilder.CreateBox(`${vehicle.id}-hood`, { width: 1.55, height: 0.19, depth: 1.88 }, scene);
    hood.parent = this.root;
    hood.position = new Vector3(1.18, 0.83, 0);
    hood.material = paint;

    const cabin = MeshBuilder.CreateBox(`${vehicle.id}-cabin`, { width: 2.12, height: 0.7, depth: 1.65 }, scene);
    cabin.parent = this.root;
    cabin.position = new Vector3(-0.22, 1.03, 0);
    cabin.material = glass;

    const spoiler = MeshBuilder.CreateBox(`${vehicle.id}-spoiler`, { width: 0.22, height: 0.12, depth: 2.1 }, scene);
    spoiler.parent = this.root;
    spoiler.position = new Vector3(-2.24, 1.03, 0);
    spoiler.material = trim;

    const splitter = MeshBuilder.CreateBox(`${vehicle.id}-splitter`, { width: 0.36, height: 0.08, depth: 2.2 }, scene);
    splitter.parent = this.root;
    splitter.position = new Vector3(2.48, 0.14, 0);
    splitter.material = trim;

    const light = MeshBuilder.CreateBox(`${vehicle.id}-taillight`, { width: 0.1, height: 0.22, depth: 1.45 }, scene);
    light.parent = this.root;
    light.position = new Vector3(-2.55, 0.53, 0);
    light.material = this.exhaust;

    [1.62, -1.55].forEach((x) => {
      [-0.98, 0.98].forEach((z) => {
        const wheel = MeshBuilder.CreateCylinder(`${vehicle.id}-wheel`, { diameter: 0.77, height: 0.31, tessellation: 20 }, scene);
        wheel.parent = this.root;
        wheel.position = new Vector3(x, 0.35, z);
        wheel.rotation.x = Math.PI / 2;
        wheel.material = tyre;
        this.wheels.push(wheel);
      });
    });
  }

  reset() {
    this.root.position.x = -154;
    this.root.position.y = 0.58;
    this.root.rotation.z = 0;
    this.launchPulse = 0;
  }

  update(distance: number, speed: number, rpm: number, delta: number, launched: boolean) {
    this.root.position.x = -154 + Math.min(310, distance * 0.78);
    const squatTarget = launched ? -Math.min(0.11, (rpm / 8000) * 0.12) : 0;
    this.root.position.y += (0.58 + squatTarget - this.root.position.y) * Math.min(1, delta * 10);
    this.launchPulse = Math.max(0, this.launchPulse - delta);
    this.root.rotation.z = (launched ? -0.012 : 0) + Math.sin(performance.now() * 0.002) * 0.002;
    this.wheels.forEach((wheel) => { wheel.rotation.z -= speed * delta * 1.7; });
    const heat = Math.min(0.96, 0.08 + speed / 75 + (this.launchPulse > 0 ? 0.4 : 0));
    this.exhaust.emissiveColor = new Color3(heat, heat * 0.09, 0.02);
  }

  pulseLaunch() { this.launchPulse = 0.35; }
}
