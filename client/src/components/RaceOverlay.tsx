// Midnight Redline UI design: cut-corner pit boards, dense telemetry, and restrained vermilion moments around a midnight strip.

// Midnight Redline UI design: cut-corner pit boards, dense telemetry, and restrained vermilion moments around a midnight strip.
import { useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, ChevronRight, CircleDollarSign, Gauge, LockKeyhole, RotateCcw, Settings2, Trophy, Wrench } from "lucide-react";
import type { GameWorld } from "@/game/GameWorld";
import { UPGRADES, VEHICLES, performanceClass } from "@/game/raceData";
import type { RaceSnapshot } from "@/game/types";
import CommerceSheet from "@/components/CommerceSheet";

const PLAYER_CAR_IMAGE = "/manus-storage/player-turbo-coupe-profile_aab1f5b8.png";
const RIVAL_CAR_IMAGE = "/manus-storage/rival-pearl-coupe-profile_38a0e407.png";
const BRAND_MARK = "/manus-storage/redline-gauge-needle-mark_1b6cfd44.png";
const LAUNCH_KEY_ART = "/manus-storage/midnight-redline-host-launch-key-art_01601ae0.png";

type Props = { snapshot: RaceSnapshot | null; world: GameWorld | null };
type Panel = "garage" | "events" | "membership" | "dyno";

const formatCredit = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 0 });
const time = (value: number) => value > 0 ? `${value.toFixed(3)} s` : "—.––– s";

export default function RaceOverlay({ snapshot, world }: Props) {
  const [panel, setPanel] = useState<Panel>("events");
  const [dynoRun, setDynoRun] = useState(0);
  const [showLaunch, setShowLaunch] = useState(() => !new URLSearchParams(window.location.search).has("demo"));
  const [memberReady, setMemberReady] = useState(false);
  const [vehicleChosen, setVehicleChosen] = useState(false);
  const isRaceActive = snapshot?.mode === "staging" || snapshot?.mode === "countdown" || snapshot?.mode === "racing";
  const build = useMemo(() => {
    if (!snapshot) return { hp: 0, weight: 0, grip: 0 };
    return snapshot.boughtUpgrades.reduce((stats, id) => {
      const upgrade = UPGRADES.find((item) => item.id === id);
      if (!upgrade) return stats;
      return { hp: stats.hp + (upgrade.horsepower ?? 0), weight: stats.weight + (upgrade.weight ?? 0), grip: stats.grip + (upgrade.grip ?? 0) };
    }, { hp: snapshot.currentVehicle.horsepower, weight: snapshot.currentVehicle.weight, grip: snapshot.currentVehicle.grip });
  }, [snapshot]);

  if (!snapshot || !world) {
    return <div className="game-loading"><div className="loading-rule" />INITIALIZING HARBORLINE TESTWAY</div>;
  }

  const stageLabel = snapshot.mode === "racing" ? "RACING" : snapshot.mode === "countdown" ? "TREE ARMED" : snapshot.mode === "staging" ? "STAGED" : "READY";
  const currentClass = performanceClass({ horsepower: build.hp, weight: build.weight, eta: snapshot.currentVehicle.eta });

  return (
    <div className="race-interface" aria-live="polite">
      {showLaunch && <section className="launch-gate" aria-label="Midnight Redline event opening"><img src={LAUNCH_KEY_ART} alt="Black supercharged host drag car under a midnight start light" /><div className="launch-vignette" /><div className="launch-copy"><span>FAST &amp; FURIOUS PRESENTS</span><h1>MIDNIGHT<br /><i>REDLINE</i></h1><p>32 cities. One final host run. Build a car that earns the line.</p><div className="launch-meta"><b>18+ MATURE RACING</b><b>///</b><b>HARBORLINE OPENS 23:00</b></div><button className="primary-button" onClick={() => { setShowLaunch(false); setPanel("membership"); }}>UNLOCK MEMBER ACCESS <ArrowRight size={17} /></button><small className="launch-credit">BUILT WITH MANUS</small></div><div className="launch-host"><span>FINAL HOST BUILD</span><b>BLACKOUT C8 <i>/// 1,000 HP</i></b></div></section>}
      <header className="topbar">
        <button className="brand-lockup" onClick={() => setPanel("events")} aria-label="Open event briefing">
          <img src={BRAND_MARK} alt="Midnight Redline gauge mark" className="brand-mark" />
          <span className="brand-type"><strong>FAST &amp; FURIOUS</strong><em>MIDNIGHT REDLINE</em></span>
        </button>
        <div className="topbar-center"><span className="status-dot" /> HARBORLINE TESTWAY <span className="muted-sep">/</span> LIVE QUALIFIER</div>
        <button className="credit-readout" onClick={() => setPanel("membership")}><CircleDollarSign size={16} /> <span>${formatCredit(snapshot.cash)}</span><small> CASH</small></button>
      </header>

      <aside className="telemetry-rail">
        <div className="rail-kicker">LIVE TELEMETRY <span>/// 01</span></div>
        <div className="tach-wrap">
          <div className="tach-face">
            <div className="tach-number n1">2</div><div className="tach-number n2">4</div><div className="tach-number n3">6</div><div className="tach-number n4">8</div>
            <div className="tach-redline" />
            <div className="tach-needle" style={{ transform: `rotate(${Math.min(215, -124 + (snapshot.player.rpm / 8050) * 270)}deg)` }} />
            <div className="tach-hub" />
            <div className="tach-value">{Math.round(snapshot.player.rpm).toLocaleString()}<small>RPM</small></div>
          </div>
        </div>
        <div className="telemetry-row"><span>GEAR</span><strong>0{snapshot.player.gear}</strong></div>
        <div className="telemetry-row"><span>MPH</span><strong>{Math.round(snapshot.player.speed * 2.237)}</strong></div>
        <div className="telemetry-row"><span>BOOST</span><strong>{snapshot.player.nitro ? "ARM" : "EMPTY"}</strong></div>
        <div className="rail-strip"><span>LAUNCH</span><b className={snapshot.player.launchQuality === "WHEELSPIN" ? "warning" : ""}>{snapshot.player.launchQuality}</b></div>
      </aside>

      <section className="race-brief">
        <div className="event-tag">ROUND {String(snapshot.round + 1).padStart(2, "0")} <span>•</span> {snapshot.rivalData.className.toUpperCase()}</div>
        <h1>{snapshot.rivalData.handle}<span> // </span>{snapshot.rivalData.name.split(" ")[0]}</h1>
        <p>{snapshot.message}</p>
        <div className="match-badges"><span><Gauge size={13} /> {currentClass} MATCH</span><span>{build.hp} HP / {build.weight} KG</span></div>
      </section>

      <div className="right-deck">
        <button className={`deck-button ${panel === "garage" ? "active" : ""}`} onClick={() => setPanel(memberReady ? "garage" : "membership")}><Wrench size={17} /> <span>GARAGE</span></button>
        <button className={`deck-button ${panel === "dyno" ? "active" : ""}`} onClick={() => setPanel(memberReady && vehicleChosen ? "dyno" : memberReady ? "garage" : "membership")}><Gauge size={17} /> <span>DYNO</span></button>
        <button className={`deck-button ${panel === "events" ? "active" : ""}`} onClick={() => setPanel(memberReady && vehicleChosen ? "events" : memberReady ? "garage" : "membership")}><Trophy size={17} /> <span>EVENTS</span></button>
        <button className={`deck-button ${panel === "membership" ? "active" : ""}`} onClick={() => setPanel("membership")}><BadgeDollarSign size={17} /> <span>NITRO PASS</span></button>
      </div>

      {!isRaceActive && snapshot.mode !== "results" && (
        <section className={`pit-sheet ${!memberReady || panel === "membership" ? "commerce-sheet" : panel}`}>
          {!memberReady && <CommerceSheet onDemoActivate={() => { setMemberReady(true); setPanel("garage"); }} />}
          {memberReady && panel === "events" && <EventSheet snapshot={snapshot} world={world} onGarage={() => setPanel("garage")} />}
          {memberReady && panel === "garage" && <GarageSheet snapshot={snapshot} world={world} build={build} vehicleChosen={vehicleChosen} onVehicleSelected={() => setVehicleChosen(true)} />}
          {memberReady && !vehicleChosen && panel !== "membership" && <GarageSheet snapshot={snapshot} world={world} build={build} vehicleChosen={vehicleChosen} onVehicleSelected={() => setVehicleChosen(true)} />}
          {memberReady && panel === "dyno" && <DynoSheet snapshot={snapshot} build={build} run={dynoRun} onRun={() => setDynoRun((value) => value + 1)} />}
          {memberReady && panel === "membership" && <CommerceSheet onDemoActivate={() => { setMemberReady(true); setPanel("garage"); }} />}
        </section>
      )}

      <section className="timing-dock">
        <div className="tree-inline" aria-label={`Starting tree is ${snapshot.tree}`}>
          {(["stage", "amber1", "amber2", "amber3", "green", "red"] as const).map((lamp) => <span key={lamp} className={`tree-lamp ${lamp} ${snapshot.tree === lamp || (snapshot.tree === "staged" && lamp === "stage") ? "lit" : ""}`} />)}
        </div>
        <div className="time-cell"><span>REACTION</span><strong>{snapshot.player.reaction ? `${snapshot.player.reaction.toFixed(3)} s` : "—.–––"}</strong></div>
        <div className="time-cell main-time"><span>ELAPSED TIME</span><strong>{time(snapshot.player.elapsed)}</strong></div>
        <div className="time-cell"><span>TRACK</span><strong>{Math.round((snapshot.player.distance / 402.34) * 100)}%</strong></div>
        <div className={`stage-pill ${snapshot.mode.toLowerCase()}`}>{stageLabel}</div>
      </section>

      <section className="race-controls" aria-label="Race controls">
        <button className="control-action stage-action" onClick={() => snapshot.mode === "staging" ? world.armTree() : world.beginRace()}>
          <span>{snapshot.mode === "staging" ? "[S]" : "[E]"}</span>{snapshot.mode === "staging" ? "ARM TREE" : "ENTER / STAGE"}
        </button>
        <button className="control-action throttle-action" onPointerDown={() => world.setThrottle(true)} onPointerUp={() => world.setThrottle(false)} onPointerLeave={() => world.setThrottle(false)}><span>[SPACE]</span>HOLD THROTTLE</button>
        <button className="control-action shift-action" onClick={() => world.shift()}><span>[SHIFT]</span>SHIFT</button>
        <button className="control-action nitro-action" onClick={() => world.useNitro()} disabled={!snapshot.player.nitro}><span>[N]</span>NITRO</button>
      </section>

      {snapshot.mode === "results" && snapshot.result && <ResultSheet snapshot={snapshot} world={world} />}
      <div className="game-note">SETTLEMENT SIMULATION <span>•</span> CASH LEDGER <span>•</span> NO BANKING CREDENTIALS COLLECTED</div>
    </div>
  );
}

function EventSheet({ snapshot, world, onGarage }: { snapshot: RaceSnapshot; world: GameWorld; onGarage: () => void }) {
  const rival = snapshot.rivalData;
  const creatorCut = Math.round(rival.purse * 0.14);
  return <>
    <div className="sheet-eyebrow">NEXT QUALIFIER <span>—</span> MEMBER EVENT</div>
    <div className="event-layout">
      <div className="event-copy"><h2>{rival.name}</h2><p className="handle">@{rival.handle.toLowerCase()} <span>•</span> {rival.vehicle}</p><p className="brief-copy">{rival.briefing}</p><div className="spec-line"><span>CLASS <b>{rival.className}</b></span><span>EST. ET <b>{rival.eta.toFixed(2)}s</b></span><span>POWER <b>{rival.horsepower} HP</b></span></div></div>
      <div className="event-visual"><img src={RIVAL_CAR_IMAGE} alt="Pearl white rival racing coupe" /></div>
    </div>
    <div className="entry-ledger"><div><span>BUY-IN</span><b>${formatCredit(rival.buyIn)}</b></div><div><span>GROSS PURSE</span><b>${formatCredit(rival.purse)}</b></div><div><span>CREATOR ALLOCATION</span><b>${formatCredit(creatorCut)}</b></div><div className="win"><span>WINNER AWARD</span><b>${formatCredit(rival.purse - creatorCut)}</b></div></div>
    <div className="sheet-actions"><button className="minor-button" onClick={onGarage}><Settings2 size={15} /> INSPECT SETUP</button><button className="minor-button" onClick={() => world.beginRace(true)}>PINK SLIP / NOVA 8</button><button className="primary-button" onClick={() => world.beginRace()}>CONFIRM ENTRY <ArrowRight size={17} /></button></div>
    <p className="settlement-note"><LockKeyhole size={13} /> Subscriber transfers are initiated through their own bank. This build simulates cash settlement and never requests banking credentials.</p>
  </>;
}

function GarageSheet({ snapshot, world, build, vehicleChosen, onVehicleSelected }: { snapshot: RaceSnapshot; world: GameWorld; build: { hp: number; weight: number; grip: number }; vehicleChosen: boolean; onVehicleSelected: () => void }) {
  const [catalogCategory, setCatalogCategory] = useState("ALL");
  const [pendingUpgradeId, setPendingUpgradeId] = useState<string | null>(null);
  const estimatedEta = Math.max(8.9, snapshot.currentVehicle.eta - (build.hp - snapshot.currentVehicle.horsepower) * 0.0023 - Math.max(0, snapshot.currentVehicle.weight - build.weight) * 0.0009 - (build.grip - snapshot.currentVehicle.grip) * 0.5);
  const compatibleParts = UPGRADES.filter((upgrade) => upgrade.compatible.includes(snapshot.currentVehicle.archetype));
  const categories = ["ALL", ...Array.from(new Set(compatibleParts.map((upgrade) => upgrade.category)))];
  const catalogParts = catalogCategory === "ALL" ? compatibleParts : compatibleParts.filter((upgrade) => upgrade.category === catalogCategory);
  const pendingUpgrade = UPGRADES.find((upgrade) => upgrade.id === pendingUpgradeId);
  return <>
    <div className="sheet-eyebrow">PLAYER GARAGE <span>—</span> {vehicleChosen ? "BUILD SHEET" : "CHOOSE & PAY FOR A BUILD"}</div>
    <div className="garage-hero"><img src={PLAYER_CAR_IMAGE} alt="Graphite turbo coupe in the player garage" /><div className="garage-hero-copy"><span>{snapshot.currentVehicle.tag}</span><h2>{snapshot.currentVehicle.name}</h2><p>{snapshot.currentVehicle.description}</p><b>{performanceClass({ horsepower: build.hp, weight: build.weight, eta: snapshot.currentVehicle.eta })} COMPETITION BAND</b></div></div>
    <div className="build-metrics"><span><b>{build.hp}</b> HP</span><span><b>{build.weight}</b> KG</span><span><b>{(build.grip * 100).toFixed(1)}</b>% GRIP</span><span><b>{estimatedEta.toFixed(2)}</b> EST. ET</span></div>
    <div className="garage-scroll"><div className="section-label">{vehicleChosen ? "AVAILABLE BUILDS" : "MEMBER VEHICLE ACCESS — SELECT A PAID BUILD"}</div><div className="vehicle-row">{VEHICLES.slice(0, 6).map((vehicle) => { const selected = vehicleChosen && vehicle.id === snapshot.currentVehicle.id; return <button className={`vehicle-chip ${selected ? "selected" : ""}`} key={vehicle.id} onClick={() => { world.purchaseVehicle(vehicle.id); onVehicleSelected(); }}><i style={{ background: vehicle.color, borderColor: vehicle.accent }} /><span>{vehicle.name}<small>{vehicle.className} · {vehicle.horsepower} HP</small></span><em>{selected ? "SELECTED" : vehicleChosen && vehicle.id !== snapshot.currentVehicle.id ? `$${formatCredit(vehicle.price)}` : `ACCESS $${formatCredit(vehicle.price)}`}</em></button>; })}</div>{vehicleChosen && <><div className="section-label upgrade-label">{snapshot.currentVehicle.name.toUpperCase()} COMPATIBLE PARTS</div><div className="catalog-tabs">{categories.map((category) => <button key={category} className={catalogCategory === category ? "active" : ""} onClick={() => setCatalogCategory(category)}>{category}</button>)}</div><div className="upgrade-grid">{catalogParts.map((upgrade) => <button key={upgrade.id} className={`upgrade-card ${snapshot.boughtUpgrades.includes(upgrade.id) ? "installed" : ""}`} onClick={() => snapshot.boughtUpgrades.includes(upgrade.id) ? undefined : setPendingUpgradeId(upgrade.id)}><span>{upgrade.category}</span><b>{upgrade.name}</b><small>{upgrade.detail}</small><em>{snapshot.boughtUpgrades.includes(upgrade.id) ? "INSTALLED" : `$${formatCredit(upgrade.price)}`}</em></button>)}</div>{pendingUpgrade && <div className="install-confirm"><div><span>PAYMENT APPROVAL REQUIRED</span><b>{pendingUpgrade.name} <em>— ${formatCredit(pendingUpgrade.price)}</em></b><small>{pendingUpgrade.detail}. The build changes only after approval.</small></div><div><button className="minor-button" onClick={() => setPendingUpgradeId(null)}>CANCEL</button><button className="primary-button" onClick={() => { world.purchaseUpgrade(pendingUpgrade.id); setPendingUpgradeId(null); }}>CONFIRM & INSTALL <ArrowRight size={15} /></button></div></div>}</>}</div>
  </>;
}

function MembershipSheet({ onActivate }: { onActivate: () => void }) {
  const [transferStarted, setTransferStarted] = useState(false);
  return <>
    <div className="sheet-eyebrow">MEMBER GARAGE <span>—</span> SEASON 01</div>
    <div className="pass-layout"><div><div className="pass-stamp">NITRO<br />PASS</div><h2>Keep the night moving.</h2><p>Membership is required to enter the competitive garage, run the dyno, join qualifiers, and progress through the 32-city circuit. It does not add hidden power to a race build.</p><div className="pass-benefits"><span>QUALIFIER ACCESS</span><span>SEASONAL GARAGE SIGNALS</span><span>FULL SLIP TELEMETRY</span><span>MEMBER TIME TRIALS</span></div></div><aside><span>REQUIRED MEMBERSHIP</span><b>$12 <small>/ MONTH</small></b><em>{transferStarted ? "BANK APPROVAL STARTED" : "DIRECT-TRANSFER READY"}</em><p>{transferStarted ? "Approve the membership in your bank’s own experience, then return once the transfer reference is issued." : "Start in your own bank. The platform never asks for or stores credentials."}</p><button className="primary-button" onClick={() => transferStarted ? onActivate() : setTransferStarted(true)}>{transferStarted ? "CONFIRM MEMBER ACCESS" : "START BANK APPROVAL"} <ChevronRight size={17} /></button></aside></div>
    {transferStarted && <div className="bank-handoff"><LockKeyhole size={14} /><span><b>BANK-INITIATED PAYMENT</b> — $12 membership approval is started outside the game. No login, account, routing, or card data is collected here.</span></div>}
  </>;
}

function DynoSheet({ snapshot, build, run, onRun }: { snapshot: RaceSnapshot; build: { hp: number; weight: number; grip: number }; run: number; onRun: () => void }) {
  const peakHp = build.hp + (run ? Math.round(build.hp * 0.012) : 0);
  const peakTorque = Math.round(peakHp * 0.89);
  const points = Array.from({ length: 9 }, (_, index) => {
    const load = 0.48 + Math.sin((index / 8) * Math.PI * 0.84) * 0.51;
    return `${18 + index * 33},${112 - load * 88}`;
  }).join(" ");
  return <>
    <div className="sheet-eyebrow">DYNO BAY <span>—</span> LIVE BUILD VALIDATION</div>
    <div className="dyno-layout"><section><div className="dyno-title"><span>{snapshot.currentVehicle.name.toUpperCase()}</span><h2>Make the pull.</h2><p>Run the car before entry. The curve exposes where your power arrives—and whether the tune belongs in the selected class.</p></div><div className="dyno-graph"><div className="graph-label">HORSEPOWER</div><svg viewBox="0 0 300 130" role="img" aria-label="Estimated dyno horsepower curve"><defs><linearGradient id="dynoLine" x1="0" x2="1"><stop stopColor="#d7a559"/><stop offset=".6" stopColor="#e44324"/><stop offset="1" stopColor="#ffcc72"/></linearGradient></defs><path d="M18 112 H282 M18 82 H282 M18 52 H282 M18 22 H282 M18 15 V112 H282" fill="none" stroke="rgba(214,224,222,.18)" strokeWidth="1"/><polyline points={points} fill="none" stroke="url(#dynoLine)" strokeWidth="3" strokeLinecap="square" /></svg><div className="graph-axis"><span>3K</span><span>4.5K</span><span>6K</span><span>7.5K</span><span>8K RPM</span></div></div></section><aside className="dyno-card"><span>PEAK OUTPUT</span><b>{peakHp}<small> HP</small></b><div><span>PEAK TORQUE</span><strong>{peakTorque} LB-FT</strong></div><div><span>LAUNCH GRIP</span><strong>{(build.grip * 100).toFixed(1)}%</strong></div><div><span>POWER-TO-WEIGHT</span><strong>{(peakHp / build.weight).toFixed(3)}</strong></div><em>{run ? "RUN LOGGED / TUNE APPLIED" : "READY TO PULL"}</em><button className="primary-button" onClick={onRun}>{run ? "RUN AGAIN" : "RUN DYNO"} <Gauge size={16} /></button></aside></div>
    <p className="settlement-note"><Gauge size={13} /> Dyno runs validate the active setup before cash-event entry. Performance changes remain visible in the garage and class match.</p>
  </>;
}

function ResultSheet({ snapshot, world }: { snapshot: RaceSnapshot; world: GameWorld }) {
  const result = snapshot.result!;
  return <section className={`result-sheet ${result.won ? "win" : "loss"}`}><div className="result-kicker">OFFICIAL SLIP <span>///</span> ROUND {String(snapshot.round + 1).padStart(2, "0")}</div><h2>{result.redLight ? "RED LIGHT" : result.won ? "YOU TOOK THE LINE" : "RIVAL TOOK THE LINE"}</h2><p>{snapshot.message}</p><div className="slip-times"><div><span>YOUR ET</span><b>{time(result.playerET)}</b></div><div><span>{snapshot.rivalData.handle} ET</span><b>{time(result.rivalET)}</b></div><div><span>REACTION</span><b>{snapshot.player.reaction.toFixed(3)} s</b></div></div><div className="result-waterfall"><span>BUY-IN <b>−${formatCredit(snapshot.entry)}</b></span><span>GROSS PURSE <b>${formatCredit(snapshot.purse)}</b></span><span>CREATOR ALLOCATION <b>${formatCredit(result.creatorAllocation)}</b></span><span className="award">YOUR AWARD <b>+${formatCredit(result.payout)}</b></span></div>{result.awardedVehicle && <div className="pink-slip-award">PINK SLIP TRANSFERRED <b>{result.awardedVehicle.toUpperCase()}</b></div>}<div className="result-actions"><button className="minor-button" onClick={() => world.setMode("garage")}><Wrench size={15} /> RETURN TO GARAGE</button><button className="primary-button" onClick={() => result.won ? world.selectRound(Math.min(snapshot.unlockedRound, snapshot.round + 1)) : world.setMode("briefing")}>{result.won ? "NEXT QUALIFIER" : "RUN IT BACK"} <RotateCcw size={16} /></button></div></section>;
}
