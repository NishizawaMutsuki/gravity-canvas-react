"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  GravityCanvas: () => GravityCanvas
});
module.exports = __toCommonJS(index_exports);

// src/GravityCanvas.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function GravityCanvas({
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
  className
}) {
  const canvasRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const c = canvasRef.current;
    if (!c) return;
    const parent = c.parentElement;
    const rect = parent.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const [cr, cg, cb] = color;
    const ps = Array.from({ length: particleCount }, () => {
      const r = radiusMin + Math.random() * radiusRange;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        mass: r * r,
        vx: (Math.random() - 0.5) * initialSpeed,
        vy: (Math.random() - 0.5) * initialSpeed,
        alive: true
      };
    });
    const sCx = w / 2;
    const sCy = h / 2 + h * shieldOffsetY;
    const sR = Math.min(w, h) * shieldRadius;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const alive = ps.filter((p) => p.alive);
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
          const force = gravity * a.mass * b.mass / Math.max(distSq, 100);
          const fx = force * dx / dist;
          const fy = force * dy / dist;
          a.vx += fx / a.mass;
          a.vy += fy / a.mass;
          b.vx -= fx / b.mass;
          b.vy -= fy / b.mass;
        }
      }
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
    dpr
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "canvas",
    {
      ref: canvasRef,
      className,
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GravityCanvas
});
