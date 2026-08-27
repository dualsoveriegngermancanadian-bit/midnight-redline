// Midnight Redline game design: a wet midnight strip, physical timing lights, and a low side-on race camera.

import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { GameWorld } from "./GameWorld";

export type GameHandle = { scene: Scene; world: GameWorld; dispose: () => void };

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.016, 0.026, 0.05, 1);
  scene.ambientColor = Color3.FromHexString("#243045");

  const camera = new ArcRotateCamera("race-camera", -1.48, 1.08, 40, new Vector3(-148, 1.15, 0), scene);
  camera.lowerRadiusLimit = 40;
  camera.upperRadiusLimit = 40;
  camera.lowerBetaLimit = 1.08;
  camera.upperBetaLimit = 1.08;
  camera.lowerAlphaLimit = -1.48;
  camera.upperAlphaLimit = -1.48;
  camera.fov = 0.86;
  camera.attachControl(canvas, false);

  const sky = new HemisphericLight("midnight-sky", new Vector3(0, 1, 0), scene);
  sky.diffuse = Color3.FromHexString("#465e80");
  sky.groundColor = Color3.FromHexString("#060a10");
  sky.intensity = 0.42;

  const asphalt = new StandardMaterial("wet-asphalt", scene);
  asphalt.diffuseColor = Color3.FromHexString("#0a1019");
  asphalt.specularColor = Color3.FromHexString("#738496");
  asphalt.specularPower = 84;
  const road = MeshBuilder.CreateGround("quarter-mile", { width: 328, height: 14, subdivisions: 12 }, scene);
  road.position = new Vector3(0, 0, 0);
  road.material = asphalt;

  const lineMaterial = new StandardMaterial("lanes", scene);
  lineMaterial.diffuseColor = Color3.FromHexString("#d9d6c8");
  lineMaterial.emissiveColor = Color3.FromHexString("#171816");
  [-2.5, 2.5].forEach((z) => {
    const line = MeshBuilder.CreateBox(`lane-${z}`, { width: 326, height: 0.024, depth: 0.09 }, scene);
    line.position = new Vector3(0, 0.02, z === -2.5 ? -4.45 : 4.45);
    line.material = lineMaterial;
  });
  const centerLine = MeshBuilder.CreateBox("center-line", { width: 326, height: 0.026, depth: 0.1 }, scene);
  centerLine.position.y = 0.024;
  centerLine.material = lineMaterial;

  const startMaterial = new StandardMaterial("start-line", scene);
  startMaterial.diffuseColor = Color3.FromHexString("#e44324");
  startMaterial.emissiveColor = Color3.FromHexString("#3c0a05");
  const start = MeshBuilder.CreateBox("redline-start", { width: 0.22, height: 0.03, depth: 12.2 }, scene);
  start.position = new Vector3(-154, 0.04, 0);
  start.material = startMaterial;

  const concrete = new StandardMaterial("concrete", scene);
  concrete.diffuseColor = Color3.FromHexString("#1e2a36");
  concrete.specularColor = Color3.FromHexString("#26313c");
  [-94, -18, 58, 134].forEach((x) => {
    const pillar = MeshBuilder.CreateBox(`pillar-${x}`, { width: 4, height: 24, depth: 4 }, scene);
    pillar.position = new Vector3(x, 12, -19);
    pillar.material = concrete;
    const beam = MeshBuilder.CreateBox(`beam-${x}`, { width: 84, height: 2.6, depth: 8 }, scene);
    beam.position = new Vector3(x + 36, 23, -19);
    beam.material = concrete;
  });

  const barrier = new StandardMaterial("barriers", scene);
  barrier.diffuseColor = Color3.FromHexString("#4c5661");
  [-7.2, 7.2].forEach((z) => {
    const rail = MeshBuilder.CreateBox(`rail-${z}`, { width: 326, height: 0.62, depth: 0.38 }, scene);
    rail.position = new Vector3(0, 0.44, z);
    rail.material = barrier;
  });

  const finish = MeshBuilder.CreateBox("finish-truss", { width: 1.2, height: 9.6, depth: 13.5 }, scene);
  finish.position = new Vector3(151, 4.8, 0);
  finish.material = concrete;
  const finishLight = new PointLight("finish-lamp", new Vector3(151, 8, 0), scene);
  finishLight.diffuse = Color3.FromHexString("#ffaf53");
  finishLight.intensity = 3.2;
  finishLight.range = 42;
  const startLight = new PointLight("start-lamp", new Vector3(-148, 8, 0), scene);
  startLight.diffuse = Color3.FromHexString("#f6a65c");
  startLight.intensity = 7.2;
  startLight.range = 44;
  const launchFill = new PointLight("launch-fill", new Vector3(-153, 3, -7), scene);
  launchFill.diffuse = Color3.FromHexString("#b9d4ee");
  launchFill.intensity = 4.5;
  launchFill.range = 32;

  const world = new GameWorld(scene);
  scene.onBeforeRenderObservable.add(() => world.update(Math.min(0.05, engine.getDeltaTime() / 1000)));
  return { scene, world, dispose: () => { camera.detachControl(); scene.dispose(); } };
}
