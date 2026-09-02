"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const AGENTS = [
  { id: "idea", label: "Idea", color: "#8b5cf6", glow: "#a78bfa" },
  { id: "market", label: "Market", color: "#6366f1", glow: "#818cf8" },
  { id: "compete", label: "Compete", color: "#6366f1", glow: "#818cf8" },
  { id: "model", label: "Model", color: "#a78bfa", glow: "#c4b5fd" },
  { id: "finance", label: "Finance", color: "#c4b5fd", glow: "#ddd6fe" },
  { id: "mvp", label: "MVP", color: "#eab308", glow: "#facc15" },
  { id: "gtm", label: "GTM", color: "#f59e0b", glow: "#fbbf24" },
  { id: "verdict", label: "Verdict", color: "#ef4444", glow: "#f87171" },
];

function fibonacciSphere(count: number, radius: number) {
  const points: { x: number; y: number; z: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    });
  }
  return points;
}

function rotatePoint(x: number, y: number, z: number, rotX: number, rotY: number) {
  const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
  const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
  const y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
  const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
  return { x: x1, y: y1, z: z2 };
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function buildWireframe(radius: number, rotX: number, rotY: number, focal: number, cx: number, cy: number, scale: number) {
  const lines: { x1: number; y1: number; x2: number; y2: number; z: number }[] = [];

  const project = (x: number, y: number, z: number) => {
    const r = rotatePoint(x, y, z, rotX, rotY);
    const p = focal / (focal + r.z);
    return { sx: cx + r.x * scale * p, sy: cy + r.y * scale * p, z: r.z };
  };

  // Latitude rings
  for (let lat = -60; lat <= 60; lat += 30) {
    const latRad = (lat * Math.PI) / 180;
    const ringR = radius * Math.cos(latRad);
    const y0 = radius * Math.sin(latRad);
    const segments = 36;
    let prev: ReturnType<typeof project> | null = null;
    for (let s = 0; s <= segments; s++) {
      const lon = (s / segments) * Math.PI * 2;
      const pt = project(ringR * Math.cos(lon), y0, ringR * Math.sin(lon));
      if (prev) lines.push({ x1: prev.sx, y1: prev.sy, x2: pt.sx, y2: pt.sy, z: (prev.z + pt.z) / 2 });
      prev = pt;
    }
  }

  // Longitude meridians
  for (let lon = 0; lon < 360; lon += 30) {
    const lonRad = (lon * Math.PI) / 180;
    const segments = 24;
    let prev: ReturnType<typeof project> | null = null;
    for (let s = 0; s <= segments; s++) {
      const latRad = ((s / segments) * Math.PI - Math.PI / 2);
      const x0 = radius * Math.cos(latRad) * Math.cos(lonRad);
      const y0 = radius * Math.sin(latRad);
      const z0 = radius * Math.cos(latRad) * Math.sin(lonRad);
      const pt = project(x0, y0, z0);
      if (prev) lines.push({ x1: prev.sx, y1: prev.sy, x2: pt.sx, y2: pt.sy, z: (prev.z + pt.z) / 2 });
      prev = pt;
    }
  }

  return lines.sort((a, b) => a.z - b.z);
}

export function AgentGlobeVisual() {
  const rotX = useRef(-0.35);
  const rotY = useRef(0);
  const velX = useRef(0.002);
  const velY = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [frame, setFrame] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const spherePoints = useMemo(() => fibonacciSphere(AGENTS.length, 1), []);

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const focal = 2.8;
  const nodeScale = size * 0.36;
  const sphereRadius = 0.92;

  const { projected, wireframe } = useMemo(() => {
    const rx = rotX.current;
    const ry = rotY.current;

    const projected = AGENTS.map((agent, i) => {
      const p = spherePoints[i];
      const r = rotatePoint(p.x, p.y, p.z, rx, ry);
      const perspective = focal / (focal + r.z);
      return {
        ...agent,
        sx: cx + r.x * nodeScale * perspective,
        sy: cy + r.y * nodeScale * perspective,
        z: r.z,
        perspective,
        visible: r.z > -0.8,
      };
    }).sort((a, b) => a.z - b.z);

    const wireframe = buildWireframe(sphereRadius, rx, ry, focal, cx, cy, nodeScale);

    return { projected, wireframe };
  }, [spherePoints, frame, cx, cy, nodeScale]);

  useEffect(() => {
    let id: number;
    const animate = () => {
      if (!dragging.current) {
        rotY.current += velX.current;
        rotX.current += velY.current;
        rotX.current = Math.max(-1.1, Math.min(1.1, rotX.current));
        velX.current *= 0.985;
        velY.current *= 0.985;
        if (Math.abs(velX.current) < 0.001 && Math.abs(velY.current) < 0.0001) {
          velX.current = 0.003;
        }
      }
      setFrame((f) => f + 1);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velX.current = 0;
    velY.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    rotY.current += dx * 0.007;
    rotX.current += dy * 0.007;
    rotX.current = Math.max(-1.1, Math.min(1.1, rotX.current));
    velX.current = dx * 0.00035;
    velY.current = dy * 0.00035;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setFrame((f) => f + 1);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-full min-h-[360px] md:min-h-[440px] flex flex-col items-center justify-center select-none touch-none" />
    );
  }

  return (
    <div
      className="relative w-full h-full min-h-[360px] md:min-h-[440px] flex flex-col items-center justify-center select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.07) 40%, transparent 68%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-400/30"
            style={{
              left: `${15 + ((i * 37) % 70)}%`,
              top: `${10 + ((i * 53) % 80)}%`,
              animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="relative w-[min(100%,340px)] h-auto"
        style={{ filter: "drop-shadow(0 0 40px rgba(139,92,246,0.2))" }}
      >
        <defs>
          <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" />
            <stop offset="40%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <radialGradient id="sphereFill" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.08)" />
            <stop offset="60%" stopColor="rgba(99,102,241,0.03)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="coreGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wireframe globe */}
        {wireframe.map((line, i) => (
          <line
            key={`wf-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(139,92,246,0.18)"
            strokeWidth="0.6"
            opacity={0.25 + (line.z + 1) * 0.35}
          />
        ))}

        {/* Sphere fill */}
        <circle cx={cx} cy={cy} r={nodeScale * 0.98} fill="url(#sphereFill)" />
        <circle
          cx={cx}
          cy={cy}
          r={nodeScale * 0.98}
          fill="none"
          stroke="rgba(139,92,246,0.15)"
          strokeWidth="1"
        />

        {/* Spoke lines */}
        {projected.map((node) => {
          if (!node.visible) return null;
          return (
            <line
              key={`line-${node.id}`}
              x1={cx}
              y1={cy}
              x2={node.sx}
              y2={node.sy}
              stroke={node.color}
              strokeWidth="0.8"
              strokeDasharray="2 5"
              opacity={0.06 + node.perspective * 0.22}
            />
          );
        })}

        {/* Center core — pulsing */}
        <polygon points={hexPoints(cx, cy, 24)} fill="url(#coreGrad)" filter="url(#coreGlow)" opacity="0.95" />
        <polygon points={hexPoints(cx, cy, 11)} fill="#0a0a0a" opacity="0.5" />
        <polygon points={hexPoints(cx, cy, 5.5)} fill="url(#coreGrad)" />

        {/* Agent nodes with depth */}
        {projected.map((node) => {
          if (!node.visible) return null;
          const hexR = 9 + node.perspective * 5;
          const opacity = 0.5 + node.perspective * 0.5;
          const labelOpacity = 0.4 + node.perspective * 0.6;

          return (
            <g key={node.id} opacity={opacity}>
              <circle cx={node.sx} cy={node.sy} r={hexR + 8} fill={node.glow} opacity={0.1 * node.perspective} />
              <polygon points={hexPoints(node.sx, node.sy, hexR)} fill={node.color} filter="url(#nodeGlow)" />
              <polygon points={hexPoints(node.sx, node.sy, hexR * 0.42)} fill="#0a0a0a" opacity="0.45" />
              <text
                x={node.sx}
                y={node.sy + hexR + 13}
                textAnchor="middle"
                fill="#d4d4d8"
                fontSize="9.5"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
                opacity={labelOpacity}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="absolute bottom-5 text-[11px] text-zinc-500 tracking-wide pointer-events-none flex items-center gap-2 opacity-70">
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.4 1.4M11.55 11.55l1.4 1.4M3.05 12.95l1.4-1.4M11.55 4.45l1.4-1.4" />
        </svg>
        Drag to rotate · 8 AI agents
      </p>
    </div>
  );
}
