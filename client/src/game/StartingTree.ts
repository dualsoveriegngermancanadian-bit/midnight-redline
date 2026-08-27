// Midnight Redline game design: the physical Christmas tree is the clearest expression of competitive timing.

import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import type { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { TreeState } from "./types";

type Lamp = { material: StandardMaterial; active: Color3; idle: Color3; meshY: number };

export class StartingTree {
  private readonly lamps: Record<string, Lamp> = {};
  private state: TreeState = "idle";

  constructor(scene: Scene) {
    const metal = new StandardMaterial("tree-metal", scene);
    metal.diffuseColor = Color3.FromHexString("#5d6570");
    metal.specularColor = Color3.FromHexString("#f1e5cf");
    const pole = MeshBuilder.CreateCylinder("tree-pole", { height: 5.4, diameter: 0.16, tessellation: 10 }, scene);
    pole.position = new Vector3(-142, 2.7, 0);
    pole.material = metal;
    const base = MeshBuilder.CreateBox("tree-base", { width: 0.68, height: 0.16, depth: 1.05 }, scene);
    base.position = new Vector3(-142, 0.08, 0);
    base.material = metal;

    this.addLamp(scene, "stage", 4.9, "#2ba4e7", "#07141d");
    this.addLamp(scene, "amber1", 4.05, "#ffa62f", "#1c1001");
    this.addLamp(scene, "amber2", 3.22, "#ffa62f", "#1c1001");
    this.addLamp(scene, "amber3", 2.39, "#ffa62f", "#1c1001");
    this.addLamp(scene, "green", 1.52, "#4adf6b", "#04150a");
    this.addLamp(scene, "red", 0.67, "#ef3d2d", "#180303");
  }

  private addLamp(scene: Scene, id: string, y: number, active: string, idle: string) {
    const material = new StandardMaterial(`tree-${id}`, scene);
    material.diffuseColor = Color3.FromHexString(idle);
    material.emissiveColor = Color3.FromHexString(idle);
    const lamp = MeshBuilder.CreateSphere(`tree-${id}`, { diameter: 0.48, segments: 14 }, scene);
    lamp.position = new Vector3(-142, y, 0);
    lamp.material = material;
    this.lamps[id] = { material, active: Color3.FromHexString(active), idle: Color3.FromHexString(idle), meshY: y };
  }

  setState(next: TreeState) {
    this.state = next;
    Object.entries(this.lamps).forEach(([id, lamp]) => {
      const isActive = (next === "staged" && id === "stage") || next === id || (next === "red" && id === "red");
      lamp.material.emissiveColor = isActive ? lamp.active : lamp.idle;
      lamp.material.diffuseColor = isActive ? lamp.active.scale(0.55) : lamp.idle;
    });
    if (next.startsWith("amber")) this.lamps.stage.material.emissiveColor = this.lamps.stage.active.scale(0.4);
    if (next === "green") this.lamps.stage.material.emissiveColor = this.lamps.stage.active.scale(0.34);
  }

  getState() { return this.state; }
}
