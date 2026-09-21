import React from "react"
import { cn } from "@/lib/utils"

interface IndianCargoBlenderTruckProps {
  className?: string
}

/**
 * Architectural Blender-style vector line illustration of an Indian commercial
 * multi-axle freight truck (BharatBenz / Tata Signa COE 2823/3523 profile).
 *
 * Design features:
 * - Pure SVG vector construction engineered for light/white backgrounds.
 * - Blender Freestyle line-rendering aesthetic: high-contrast dark slate strokes,
 *   geometric volumetric shading, and clean facet definition.
 * - Authentic Indian market details: Cab-Over-Engine (COE) cabin in signature
 *   TAC-XPRESS orange (#f97316), roof deflector, split windshield with sun visor,
 *   honeycomb front grille, heavy-duty underrun protection, and tandem rear axles.
 * - Zero external bitmap dependencies; 100% responsive vector.
 */
export function IndianCargoBlenderTruck({ className }: IndianCargoBlenderTruckProps) {
  return (
    <div
      className={cn("relative w-full select-none", className)}
      role="img"
      aria-label="Blender line illustration of TAC-XPRESS Indian commercial multi-axle linehaul truck"
    >
      <svg
        viewBox="0 0 1000 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Subtle gradient for container panel */}
          <linearGradient id="blender-container-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#edf2f7" />
          </linearGradient>

          {/* Container top edge highlight */}
          <linearGradient id="blender-container-top" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Cab orange body gradient */}
          <linearGradient id="blender-cab-orange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Cab dark accents and grille */}
          <linearGradient id="blender-cab-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Windshield glass reflection */}
          <linearGradient id="blender-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#64748b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
          </linearGradient>

          {/* Wheel rubber tire */}
          <radialGradient id="blender-tire" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#334155" />
            <stop offset="90%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Wheel rim steel */}
          <radialGradient id="blender-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>

          {/* Ground shadow drop */}
          <linearGradient id="blender-ground-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── GROUND PLANE & TARMAC AXIS ──────────────────────────── */}
        {/* Soft ground contact shadow */}
        <ellipse cx="500" cy="428" rx="460" ry="14" fill="url(#blender-ground-shadow)" />
        <ellipse cx="700" cy="429" rx="220" ry="10" fill="#0f172a" fillOpacity="0.25" />
        <ellipse cx="280" cy="429" rx="180" ry="10" fill="#0f172a" fillOpacity="0.2" />

        {/* Architectural ground datum line */}
        <line x1="20" y1="426" x2="980" y2="426" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* ── CHASSIS & LOWER RUNNING GEAR ───────────────────────── */}
        {/* Main longitudinal chassis beam (I-beam steel) */}
        <rect x="130" y="372" width="670" height="18" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="130" y1="381" x2="800" y2="381" stroke="#475569" strokeWidth="1" />

        {/* Fuel tank (aluminium cylindrical tank with dual steel straps) */}
        <g id="blender-fuel-tank">
          <rect x="290" y="374" width="115" height="36" rx="4" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="290" y1="386" x2="405" y2="386" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="290" y1="398" x2="405" y2="398" stroke="#94a3b8" strokeWidth="1" />
          {/* Straps */}
          <rect x="315" y="372" width="6" height="40" fill="#0f172a" />
          <rect x="375" y="372" width="6" height="40" fill="#0f172a" />
        </g>

        {/* Battery box & air tanks */}
        <g id="blender-aux-gear">
          <rect x="420" y="376" width="65" height="28" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="435" cy="390" r="5" fill="#f97316" stroke="#0f172a" strokeWidth="1" />
          <circle cx="455" cy="390" r="5" fill="#f97316" stroke="#0f172a" strokeWidth="1" />
        </g>

        {/* Side underrun protection beam (Indian CMV regulations safety bar) */}
        <g id="blender-underrun-barrier">
          <rect x="250" y="396" width="250" height="6" fill="#f97316" stroke="#1e293b" strokeWidth="1" />
          <line x1="260" y1="375" x2="260" y2="405" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="380" y1="375" x2="380" y2="405" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="490" y1="375" x2="490" y2="405" stroke="#1e293b" strokeWidth="2.5" />
          {/* Alternating safety chevron lines */}
          {[270, 310, 350, 410, 450].map((cx) => (
            <line key={cx} x1={cx} y1="396" x2={cx + 12} y2="402" stroke="#ffffff" strokeWidth="2" />
          ))}
        </g>

        {/* Mudguards / Wheel arches */}
        {/* Front wheel arch */}
        <path
          d="M 685 390 A 48 48 0 0 1 785 390 L 795 390 L 795 400 L 675 400 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
        />
        {/* Rear tandem wheel arches */}
        <path
          d="M 160 390 A 46 46 0 0 1 254 390 L 254 400 L 150 400 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* ── WHEEL ASSEMBLIES (Heavy 295/80 R22.5) ──────────────── */}
        {/* Rear Axle 1 */}
        <g id="wheel-rear-1" transform="translate(205, 395)">
          <circle r="34" fill="url(#blender-tire)" stroke="#0f172a" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1={Math.cos((angle * Math.PI) / 180) * 31}
              y1={Math.sin((angle * Math.PI) / 180) * 31}
              x2={Math.cos((angle * Math.PI) / 180) * 34}
              y2={Math.sin((angle * Math.PI) / 180) * 34}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
          <circle r="22" fill="url(#blender-rim)" stroke="#334155" strokeWidth="1.5" />
          <circle r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle r="5" fill="#f8fafc" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 16}
              cy={Math.sin((angle * Math.PI) / 180) * 16}
              r="2"
              fill="#0f172a"
            />
          ))}
        </g>

        {/* Rear Axle 2 (Tandem) */}
        <g id="wheel-rear-2" transform="translate(285, 395)">
          <circle r="34" fill="url(#blender-tire)" stroke="#0f172a" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1={Math.cos((angle * Math.PI) / 180) * 31}
              y1={Math.sin((angle * Math.PI) / 180) * 31}
              x2={Math.cos((angle * Math.PI) / 180) * 34}
              y2={Math.sin((angle * Math.PI) / 180) * 34}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
          <circle r="22" fill="url(#blender-rim)" stroke="#334155" strokeWidth="1.5" />
          <circle r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle r="5" fill="#f8fafc" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 16}
              cy={Math.sin((angle * Math.PI) / 180) * 16}
              r="2"
              fill="#0f172a"
            />
          ))}
        </g>

        {/* Front Steer Axle */}
        <g id="wheel-front" transform="translate(735, 395)">
          <circle r="34" fill="url(#blender-tire)" stroke="#0f172a" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1={Math.cos((angle * Math.PI) / 180) * 31}
              y1={Math.sin((angle * Math.PI) / 180) * 31}
              x2={Math.cos((angle * Math.PI) / 180) * 34}
              y2={Math.sin((angle * Math.PI) / 180) * 34}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
          <circle r="22" fill="url(#blender-rim)" stroke="#334155" strokeWidth="1.5" />
          <circle r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle r="5" fill="#f8fafc" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 16}
              cy={Math.sin((angle * Math.PI) / 180) * 16}
              r="2"
              fill="#0f172a"
            />
          ))}
        </g>

        {/* ── CARGO CONTAINER BODY (White sealed linehaul van) ─────────── */}
        <g id="blender-container">
          {/* Main container panel */}
          <rect
            x="110"
            y="170"
            width="490"
            height="205"
            fill="url(#blender-container-body)"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Top structural rail */}
          <rect
            x="108"
            y="166"
            width="494"
            height="12"
            fill="url(#blender-container-top)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Bottom structural sill */}
          <rect
            x="108"
            y="370"
            width="494"
            height="8"
            fill="#e2e8f0"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Container corner castings (ISO fittings) */}
          <rect x="110" y="166" width="14" height="14" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
          <rect x="586" y="166" width="14" height="14" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
          <rect x="110" y="364" width="14" height="14" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
          <rect x="586" y="364" width="14" height="14" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />

          {/* Architectural vertical corrugated ribs (Blender line aesthetic) */}
          {[160, 210, 260, 310, 360, 410, 460, 510, 560].map((rx) => (
            <g key={rx}>
              <line x1={rx} y1="178" x2={rx} y2="370" stroke="#e2e8f0" strokeWidth="2" />
              <line x1={rx + 2} y1="178" x2={rx + 2} y2="370" stroke="#cbd5e1" strokeWidth="1" />
            </g>
          ))}

          {/* Center horizontal reinforcement band */}
          <line x1="110" y1="272" x2="600" y2="272" stroke="#e2e8f0" strokeWidth="2" />

          {/* Container branding: TAC-XPRESS Stencil watermark */}
          <text
            x="140"
            y="235"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="22"
            fontWeight="bold"
            letterSpacing="6"
            fill="#94a3b8"
            fillOpacity="0.45"
          >
            TAC-XPRESS LINEHAUL
          </text>
          <text
            x="140"
            y="255"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="10"
            letterSpacing="2"
            fill="#94a3b8"
            fillOpacity="0.5"
          >
            SEALED FREIGHT CORRIDOR • DELHI ↔ NORTHEAST
          </text>

          {/* Rear cargo door locking bars and cam handles */}
          <line x1="126" y1="178" x2="126" y2="370" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="134" y1="178" x2="134" y2="370" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="123" y="270" width="14" height="6" fill="#f97316" stroke="#1e293b" strokeWidth="1.5" />
        </g>

        {/* ── CABIN / TRACTOR UNIT (Indian BharatBenz/Tata COE style) ─── */}
        <g id="blender-cabin">
          {/* Cab rear collar connector to container */}
          <rect x="595" y="240" width="22" height="135" fill="#334155" stroke="#1e293b" strokeWidth="2" />

          {/* Aerodynamic cab roof fairing / top deflector */}
          <path
            d="M 610 180 L 610 145 Q 640 130 690 130 L 730 145 L 755 180 Z"
            fill="url(#blender-cab-orange)"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          {/* Roof spoiler airflow line */}
          <path d="M 625 155 Q 670 142 725 152" stroke="#ea580c" strokeWidth="2" fill="none" />

          {/* Main Cab Outer Body (Faceted COE architecture) */}
          <path
            d="M 610 180 L 760 180 L 795 240 L 805 320 L 805 390 L 675 390 L 675 370 L 610 370 Z"
            fill="url(#blender-cab-orange)"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Cab body styling cut line (faceted crease) */}
          <path d="M 610 280 L 720 280 L 795 295" stroke="#ea580c" strokeWidth="2" fill="none" />

          {/* Large Windshield & Side Window (Curved Indian COE cab glass) */}
          {/* Side window */}
          <polygon
            points="640,195 725,195 725,260 640,260"
            fill="url(#blender-glass)"
            stroke="#1e293b"
            strokeWidth="2"
          />
          {/* Quarter glass pillar */}
          <line x1="725" y1="195" x2="725" y2="260" stroke="#1e293b" strokeWidth="3" />
          {/* Front wrap-around windshield */}
          <polygon
            points="730,195 770,205 785,255 730,260"
            fill="url(#blender-glass)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Aerodynamic sun visor strip */}
          <polygon
            points="635,188 780,188 785,198 635,198"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* FASTag Electronic Toll collection sticker */}
          <rect x="750" y="208" width="12" height="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />

          {/* Dual rear-view mirrors (wide-angle linehaul mirrors) */}
          <g id="blender-mirrors">
            {/* Mirror bracket */}
            <path d="M 770 200 L 805 190 L 805 255 L 775 250" stroke="#1e293b" strokeWidth="3" fill="none" />
            {/* Mirror housing */}
            <rect x="798" y="185" width="14" height="42" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="800" y="188" width="5" height="36" fill="#cbd5e1" />
            <rect x="798" y="232" width="14" height="18" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="800" y="234" width="5" height="14" fill="#cbd5e1" />
          </g>

          {/* Door handle recess */}
          <rect x="655" y="280" width="22" height="7" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <rect x="668" y="282" width="6" height="3" fill="#cbd5e1" />

          {/* Driver boarding steps (illuminated anti-slip treads) */}
          <g id="blender-cab-steps">
            <rect x="635" y="325" width="28" height="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <rect x="638" y="350" width="28" height="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* Heavy front radiator grille (Signature honeycomb / multi-slat) */}
          <g id="blender-grille">
            <polygon
              points="780,290 808,290 808,350 780,350"
              fill="url(#blender-cab-dark)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Grille chrome slats */}
            {[300, 312, 324, 336, 348].map((sy) => (
              <line key={sy} x1="782" y1={sy} x2="806" y2={sy} stroke="#cbd5e1" strokeWidth="2" />
            ))}
            {/* Chrome central emblem (TAC-XPRESS T-glyph) */}
            <rect x="788" y="318" width="12" height="10" rx="1" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Heavy commercial front bumper */}
          <polygon
            points="770,355 818,355 815,405 765,405"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2"
          />

          {/* Headlamp cluster (Dual LED projector + indicator) */}
          <g id="blender-headlamps">
            <rect x="796" y="365" width="16" height="16" rx="2" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="804" cy="373" r="4" fill="#38bdf8" />
            {/* Amber turn signal */}
            <rect x="796" y="384" width="16" height="7" rx="1" fill="#f59e0b" stroke="#0f172a" strokeWidth="1" />
            {/* Fog lamp in lower valence */}
            <circle cx="782" cy="390" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* Heavy-duty front tow hitch */}
          <rect x="806" y="394" width="10" height="8" rx="2" fill="#0f172a" />
        </g>

        {/* ── TECHNICAL BLENDER MEASUREMENT ANNOTATIONS ────────────── */}
        <g id="blender-tech-marks" opacity="0.4">
          <line x1="285" y1="445" x2="735" y2="445" stroke="#64748b" strokeWidth="1" />
          <line x1="285" y1="440" x2="285" y2="450" stroke="#64748b" strokeWidth="1" />
          <line x1="735" y1="440" x2="735" y2="450" stroke="#64748b" strokeWidth="1" />
          <text
            x="480"
            y="456"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="9"
            fill="#64748b"
            textAnchor="middle"
          >
            WB: 5,600 MM • 10-WHEEL 6X2 MULTI-AXLE LINEHAUL
          </text>
        </g>
      </svg>
    </div>
  )
}
