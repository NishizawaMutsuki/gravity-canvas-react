# gravity-canvas-react

A React component that renders a gravity-based particle simulation with connecting lines on an HTML5 canvas. Particles attract each other, merge on collision, and draw lines when nearby.

## Install

```bash
npm install gravity-canvas-react
```

## Usage

```tsx
import { GravityCanvas } from "gravity-canvas-react";

// Wrap in a positioned container
<div style={{ position: "relative", height: "100vh", background: "#000" }}>
  <GravityCanvas />
  <div style={{ position: "relative", zIndex: 1 }}>
    <h1>Your content here</h1>
  </div>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `[r, g, b]` | `[56, 189, 248]` | RGB color for particles and lines |
| `particleCount` | `number` | `45` | Number of particles |
| `gravity` | `number` | `0.012` | Gravitational constant |
| `connectDistance` | `number` | `150` | Max distance for connecting lines |
| `lineOpacity` | `number` | `0.25` | Max opacity of connecting lines |
| `lineWidth` | `number` | `0.8` | Width of connecting lines |
| `initialSpeed` | `number` | `0.3` | Initial velocity range |
| `damping` | `number` | `0.998` | Velocity damping per frame |
| `bounceEnergy` | `number` | `0.5` | Energy retained on bounce |
| `shield` | `boolean` | `true` | Enable center repulsion zone |
| `shieldRadius` | `number` | `0.3` | Shield radius (fraction of min dimension) |
| `shieldOffsetY` | `number` | `-0.03` | Shield Y offset (fraction of height) |
| `glow` | `boolean` | `true` | Glow effect on large particles |
| `glowThreshold` | `number` | `8` | Min radius to trigger glow |
| `radiusMin` | `number` | `2` | Minimum particle radius |
| `radiusRange` | `number` | `3.5` | Random radius range added to min |
| `dpr` | `number` | `2` | Device pixel ratio multiplier |
| `style` | `CSSProperties` | — | Additional canvas styles |
| `className` | `string` | — | Additional CSS class |

## Examples

```tsx
// Orange particles, more dense
<GravityCanvas color={[255, 140, 50]} particleCount={80} />

// Subtle background, no shield
<GravityCanvas shield={false} particleCount={20} lineOpacity={0.1} gravity={0.005} />

// Strong gravity, wide connections
<GravityCanvas gravity={0.03} connectDistance={250} />
```

## License

MIT
