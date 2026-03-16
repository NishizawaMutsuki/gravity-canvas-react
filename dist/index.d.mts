import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';

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
interface GravityCanvasProps {
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
declare function GravityCanvas({ color, particleCount, radiusMin, radiusRange, gravity, connectDistance, lineOpacity, lineWidth, initialSpeed, damping, bounceEnergy, shield, shieldRadius, shieldOffsetY, glow, glowThreshold, dpr, style, className, }: GravityCanvasProps): react_jsx_runtime.JSX.Element;

export { GravityCanvas, type GravityCanvasProps };
