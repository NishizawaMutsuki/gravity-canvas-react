"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * GravityCanvas — Gravity-based particle simulation with connecting lines.
 *
 * Particles attract each other via gravity, merge on collision,
 * and draw lines when within a configurable distance.
 * An optional center shield creates a repulsion zone for overlaying content.
 *
 * @example Basic usage
 * ```tsx
 * <div style={{ position: 'relative', height: '100vh', background: '#000' }}>
 *   <GravityCanvas />
 *   <div style={{ position: 'relative', zIndex: 1 }}>Your content</div>
 * </div>
 * ```
 *
 * @example Custom color and density
 * ```tsx
 * <GravityCanvas color={[255, 100, 50]} particleCount={80} connectDistance={200} />
 * ```
 *
 * @example No shield (particles everywhere)
 * ```tsx
 * <GravityCanvas shield={false} />
 * ```
 */

export interface GravityCanvasProps {
  /** RGB color tuple for particles and lines. Default: [56, 189, 248] (sky blue) */
  color?: [number, number, number];
  /** Number of particles. Default: 45 */
  particleCount?: number;
  /** Min particle radius. Default: 2 */
  radiusMin?: number;
  /** Max additional random radius. Default: 3.5 */
  radiusRange?: number;
  /** Gravitational constant. Higher = stronger attraction. Default: 0.012 */
  gravity?: number;
  /** Max distance for drawing connecting lines. Default: 150 */
  connectDistance?: number;
  /** Max opacity for connecting lines. Default: 0.25 */
  lineOpacity?: number;
  /** Line width. Default: 0.8 */
  lineWidth?: number;
  /** Initial velocity range (±). Default: 0.3 */
  initialSpeed?: number;
  /** Velocity damping per frame (0-1). Default: 0.998 */
  damping?: number;
  /** Bounce energy retention on wall/shield collision. Default: 0.5 */
  bounceEnergy?: number;
  /** Enable center shield (repulsion zone). Default: true */
  shield?: boolean;
  /** Shield radius as fraction of min(width, height). Default: 0.3 */
  shieldRadius?: number;
  /** Shield center Y offset as fraction of height. Default: -0.03 */
  shieldOffsetY?: number;
  /** Enable glow effect on large particles. Default: true */
  glow?: boolean;
  /** Glow threshold — min radius to trigger glow. Default: 8 */
  glowThreshold?: number;
  /** Device pixel ratio multiplier. Default: 2 */
  dpr?: number;
  /** Additional CSS styles for the canvas element */
  style?: CSSProperties;
  /** Additional CSS class name */
  className?: string;
}

export default function GravityCanvas({
  color = [56, 189, 248],
  particleCount = 45,
  radiusMin = 2,
  radiusRange = 3.5,
  gravity = 0.012,
  connectDistance = 150,
  lineOpacity = 0.25,
  lineWidth = 0.8,
  initialSpeed = 0.3,
  damping = 0.998,
  bounceEnergy = 0.5,
  shield = true,
  shieldRadius = 0.3,
  shieldOffsetY = -0.03,
  glow = true,
  glowThreshold = 8,
  dpr = 2,
  style,
  className,
}: GravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const parent = c.parentElement!;
    const rect = parent.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const [cr, cg, cb] = color;

    type P = {
      x: number;
      y: number;
      r: number;
      mass: number;
      vx: number;
      vy: number;
      alive: boolean;
    };

    const ps: P[] = Array.from({ length: particleCount }, () => {
      const r = radiusMin + Math.random() * radiusRange;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        mass: r * r,
        vx: (Math.random() - 0.5) * initialSpeed,
        vy: (Math.random() - 0.5) * initialSpeed,
        alive: true,
      };
    });

    const sCx = w / 2;
    const sCy = h / 2 + h * shieldOffsetY;
    const sR = Math.min(w, h) * shieldRadius;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const alive = ps.filter((p) => p.alive);

      // Shield repulsion
      if (shield) {
        alive.forEach((p) => {
          const dx = p.x - sCx;
          const dy = p.y - sCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = sR + p.r;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            p.x = sCx + nx * minDist;
            p.y = sCy + ny * minDist;
            const dot = p.vx * nx + p.vy * ny;
            p.vx -= 2 * dot * nx * (1 - bounceEnergy);
            p.vy -= 2 * dot * ny * (1 - bounceEnergy);
          }
        });
      }

      // Gravity & merge
      for (let i = 0; i < alive.length; i++) {
        for (let j = i + 1; j < alive.length; j++) {
          const a = alive[i];
          const b = alive[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          if (dist < 1) continue;

          if (dist < a.r + b.r) {
            const big = a.mass >= b.mass ? a : b;
            const sm = a.mass >= b.mass ? b : a;
            const tm = big.mass + sm.mass;
            big.vx = (big.vx * big.mass + sm.vx * sm.mass) / tm;
            big.vy = (big.vy * big.mass + sm.vy * sm.mass) / tm;
            big.x = (big.x * big.mass + sm.x * sm.mass) / tm;
            big.y = (big.y * big.mass + sm.y * sm.mass) / tm;
            big.mass = tm;
            big.r = Math.sqrt(tm);
            sm.alive = false;
            continue;
          }

          const force =
            (gravity * a.mass * b.mass) / Math.max(distSq, 100);
          const fx = (force * dx) / dist;
          const fy = (force * dy) / dist;
          a.vx += fx / a.mass;
          a.vy += fy / a.mass;
          b.vx -= fx / b.mass;
          b.vy -= fy / b.mass;
        }
      }

      // Connecting lines
      for (let i = 0; i < alive.length; i++) {
        for (let j = i + 1; j < alive.length; j++) {
          const dx = alive[i].x - alive[j].x;
          const dy = alive[i].y - alive[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDistance) {
            const opacity = (1 - dist / connectDistance) * lineOpacity;
            ctx.beginPath();
            ctx.moveTo(alive[i].x, alive[i].y);
            ctx.lineTo(alive[j].x, alive[j].y);
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        }
      }

      // Move & draw particles
      alive.forEach((p) => {
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.r) {
          p.x = p.r;
          p.vx *= -bounceEnergy;
        }
        if (p.x > w - p.r) {
          p.x = w - p.r;
          p.vx *= -bounceEnergy;
        }
        if (p.y < p.r) {
          p.y = p.r;
          p.vy *= -bounceEnergy;
        }
        if (p.y > h - p.r) {
          p.y = h - p.r;
          p.vy *= -bounceEnergy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(
          0.45,
          0.18 + p.r * 0.012
        )})`;
        ctx.fill();

        if (glow && p.r > glowThreshold) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(
            p.x,
            p.y,
            p.r * 0.5,
            p.x,
            p.y,
            p.r * 2.5
          );
          g.addColorStop(0, `rgba(${cr},${cg},${cb},0.06)`);
          g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = g;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [
    color,
    particleCount,
    radiusMin,
    radiusRange,
    gravity,
    connectDistance,
    lineOpacity,
    lineWidth,
    initialSpeed,
    damping,
    bounceEnergy,
    shield,
    shieldRadius,
    shieldOffsetY,
    glow,
    glowThreshold,
    dpr,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
}
