// Midnight Redline UI design: React frames the race; Babylon owns the midnight strip and all gameplay simulation.

import { useEffect, useRef, useState } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createGameScene, type GameHandle } from "@/game/scene";
import type { GameWorld } from "@/game/GameWorld";
import type { RaceSnapshot } from "@/game/types";
import RaceOverlay from "./RaceOverlay";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const worldRef = useRef<GameWorld | null>(null);
  const [world, setWorld] = useState<GameWorld | null>(null);
  const [snapshot, setSnapshot] = useState<RaceSnapshot | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    let disposed = false;
    let handle: GameHandle | null = null;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    const onResize = () => engine.resize();
    const onKeyDown = (event: KeyboardEvent) => {
      const game = worldRef.current;
      if (!game) return;
      if (event.code === "Space") { event.preventDefault(); game.setThrottle(true); }
      if (event.code === "KeyS") game.armTree();
      if (event.code === "KeyE") game.beginRace();
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") game.shift();
      if (event.code === "KeyN") game.useNitro();
    };
    const onKeyUp = (event: KeyboardEvent) => { if (event.code === "Space") worldRef.current?.setThrottle(false); };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    createGameScene(engine, canvas).then((created) => {
      if (disposed) { created.dispose(); return; }
      handle = created;
      worldRef.current = created.world;
      created.world.subscribe((next) => !disposed && setSnapshot(next));
      setWorld(created.world);
      engine.runRenderLoop(() => created.scene.render());
    });

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      worldRef.current = null;
      handle?.dispose();
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  return <main className="game-shell"><canvas ref={canvasRef} className="game-canvas" style={{ touchAction: "none" }} /><RaceOverlay snapshot={snapshot} world={world} /></main>;
}
