"use client";

import { useEffect, useRef } from "react";

const TAU: number = Math.PI * 2;
const TRAIL_STEPS: number = 7;
const CURVE_POINTS: number = 420;
const STATIC_PHASE: number = 1.3;
/** Below this CSS size the corner readouts would collide with the hero copy. */
const READOUT_MIN_SIZE: number = 300;

/** Vectorscope colour targets, in degrees, as printed on a broadcast graticule. */
const GRATICULE_TARGETS: readonly (readonly [string, number])[] = [
  ["R", 103],
  ["MG", 61],
  ["B", 347],
  ["CY", 283],
  ["G", 241],
  ["YL", 167],
];

interface ScopeState {
  size: number;
  ratio: number;
  phase: number;
  pointerX: number;
  pointerY: number;
  targetX: number;
  targetY: number;
  energy: number;
}

function tracePoint(theta: number, phase: number, state: ScopeState, radius: number): [number, number] {
  const envelope = 0.5 + 0.2 * Math.sin(5 * theta + phase * 0.9);
  const wobble = state.energy * 0.05 * Math.sin(theta * 37 + phase * 11);
  const x = (envelope + wobble) * Math.sin(3 * theta + phase * 0.6 + state.pointerX * 1.4);
  const y = (envelope - wobble) * Math.sin(2 * theta + state.pointerY * 1.4);
  return [x * radius, -y * radius];
}

function drawGraticule(context: CanvasRenderingContext2D, radius: number, ratio: number, fontFamily: string): void {
  context.lineWidth = ratio;
  context.strokeStyle = "rgb(242 239 231 / 26%)";
  context.beginPath();
  context.arc(0, 0, radius, 0, TAU);
  context.stroke();

  context.strokeStyle = "rgb(242 239 231 / 9%)";
  for (const ring of [0.75, 0.5, 0.25]) {
    context.beginPath();
    context.arc(0, 0, radius * ring, 0, TAU);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(-radius, 0);
  context.lineTo(radius, 0);
  context.moveTo(0, -radius);
  context.lineTo(0, radius);
  context.stroke();

  context.strokeStyle = "rgb(242 239 231 / 30%)";
  context.beginPath();
  for (let degrees = 0; degrees < 360; degrees += 5) {
    const angle = (degrees / 360) * TAU;
    const inner = radius * (degrees % 30 === 0 ? 0.93 : 0.97);
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  context.stroke();

  const box = 5 * ratio;
  context.font = `500 ${9 * ratio}px ${fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const [label, degrees] of GRATICULE_TARGETS) {
    const angle = -(degrees / 360) * TAU;
    const x = Math.cos(angle) * radius * 0.75;
    const y = Math.sin(angle) * radius * 0.75;
    context.strokeStyle = "rgb(216 137 141 / 55%)";
    context.strokeRect(x - box, y - box, box * 2, box * 2);
    context.fillStyle = "rgb(183 177 176 / 70%)";
    context.fillText(label, Math.cos(angle) * radius * 0.87, Math.sin(angle) * radius * 0.87);
  }
}

function drawReadout(context: CanvasRenderingContext2D, state: ScopeState, fontFamily: string): void {
  const { size, ratio } = state;
  const edge = size * ratio;
  const inset = 4 * ratio;
  const degrees = (((state.phase * 0.6 + state.pointerX * 1.4) * 360) / TAU) % 360;
  const gain = 1 + state.energy * 0.6;
  context.font = `500 ${10 * ratio}px ${fontFamily}`;
  context.textBaseline = "alphabetic";
  context.fillStyle = "rgb(183 177 176 / 80%)";
  context.textAlign = "left";
  // Both left readouts sit at the bottom: the top-left corner overlaps the hero name.
  context.fillText("VECTOR // CH-00", inset, edge - inset - 16 * ratio);
  context.fillText(`PH ${(degrees < 0 ? degrees + 360 : degrees).toFixed(1).padStart(5, "0")}°`, inset, edge - inset);
  context.textAlign = "right";
  context.fillStyle = "rgb(216 137 141 / 90%)";
  context.fillText("● LIVE", edge - inset, 12 * ratio);
  context.fillStyle = "rgb(183 177 176 / 80%)";
  context.fillText(`GAIN x${gain.toFixed(2)}`, edge - inset, edge - inset);
}

function drawScope(context: CanvasRenderingContext2D, state: ScopeState, fontFamily: string): void {
  const { size, ratio } = state;
  const edge = size * ratio;
  const radius = edge * 0.43;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, edge, edge);
  if (size >= READOUT_MIN_SIZE) drawReadout(context, state, fontFamily);
  context.translate(edge / 2, edge / 2);

  const face = context.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
  face.addColorStop(0, "rgb(22 19 22 / 78%)");
  face.addColorStop(1, "rgb(6 5 7 / 88%)");
  context.fillStyle = face;
  context.beginPath();
  context.arc(0, 0, radius, 0, TAU);
  context.fill();

  drawGraticule(context, radius, ratio, fontFamily);

  context.save();
  context.beginPath();
  context.arc(0, 0, radius - ratio, 0, TAU);
  context.clip();
  context.lineJoin = "round";
  context.globalCompositeOperation = "lighter";
  for (let step = TRAIL_STEPS - 1; step >= 0; step -= 1) {
    const phase = state.phase - step * 0.045;
    const strength = (1 - step / TRAIL_STEPS) ** 2;
    context.beginPath();
    for (let index = 0; index <= CURVE_POINTS; index += 1) {
      const [x, y] = tracePoint((index / CURVE_POINTS) * TAU, phase, state, radius);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    if (step === 0) {
      context.strokeStyle = "rgb(216 137 141 / 14%)";
      context.lineWidth = 5 * ratio;
      context.stroke();
    }
    context.strokeStyle = `rgb(216 137 141 / ${(strength * 85).toFixed(1)}%)`;
    context.lineWidth = (step === 0 ? 1.4 : 1) * ratio;
    context.stroke();
  }

  const [headX, headY] = tracePoint((state.phase * 1.7) % TAU, state.phase, state, radius);
  const glow = context.createRadialGradient(headX, headY, 0, headX, headY, 14 * ratio);
  glow.addColorStop(0, "rgb(242 239 231 / 85%)");
  glow.addColorStop(0.25, "rgb(216 137 141 / 45%)");
  glow.addColorStop(1, "rgb(216 137 141 / 0%)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(headX, headY, 14 * ratio, 0, TAU);
  context.fill();
  context.restore();
}

/**
 * Decorative vectorscope for the hero "screen". It draws a slowly morphing
 * signal trace that leans towards the pointer, and falls back to a single
 * still frame when the visitor prefers reduced motion.
 */
export function SignalScope(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect((): (() => void) | undefined => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d") ?? null;
    if (canvas === null || context === null) return undefined;

    const host = canvas.closest<HTMLElement>("[data-scene='intro']") ?? canvas;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fontFamily = getComputedStyle(canvas).fontFamily;
    const state: ScopeState = {
      size: 0, ratio: 1, phase: STATIC_PHASE, pointerX: 0, pointerY: 0, targetX: 0, targetY: 0, energy: 0,
    };
    let frame = 0;
    let previousTime = 0;
    let onScreen = true;

    const render = (): void => {
      if (state.size > 0) drawScope(context, state, fontFamily);
    };

    const tick = (time: number): void => {
      frame = 0;
      const delta = Math.min(0.05, previousTime === 0 ? 0.016 : (time - previousTime) / 1000);
      previousTime = time;
      state.pointerX += (state.targetX - state.pointerX) * 0.06;
      state.pointerY += (state.targetY - state.pointerY) * 0.06;
      state.energy *= 0.94;
      state.phase += delta * (0.42 + state.energy * 0.9);
      render();
      schedule();
    };

    const schedule = (): void => {
      if (frame !== 0 || !onScreen || document.hidden || reducedMotion.matches) return;
      frame = window.requestAnimationFrame(tick);
    };

    const pause = (): void => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };

    const resize = (): void => {
      const bounds = canvas.getBoundingClientRect();
      state.ratio = Math.min(window.devicePixelRatio || 1, 2);
      state.size = Math.round(bounds.width);
      canvas.width = Math.round(state.size * state.ratio);
      canvas.height = canvas.width;
      render();
    };

    const onPointerMove = (event: PointerEvent): void => {
      const bounds = host.getBoundingClientRect();
      const nextX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const nextY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
      state.energy = Math.min(1, state.energy + Math.hypot(nextX - state.targetX, nextY - state.targetY) * 1.5);
      state.targetX = nextX;
      state.targetY = nextY;
    };

    const onMotionPreference = (): void => {
      pause();
      if (reducedMotion.matches) {
        state.phase = STATIC_PHASE;
        state.energy = 0;
        render();
      }
      schedule();
    };

    const onVisibility = (): void => {
      pause();
      schedule();
    };

    // Both observers are progressive enhancements: without them the scope still
    // draws at its initial size and simply keeps running while off screen.
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    const visibilityObserver = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries): void => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        pause();
        schedule();
      });
    visibilityObserver?.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionPreference);
    resize();
    schedule();

    return (): void => {
      pause();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <div className="proof-intro__scope" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
