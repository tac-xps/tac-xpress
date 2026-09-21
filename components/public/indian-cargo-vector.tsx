import React from "react"
import { cn } from "@/lib/utils"

interface IndianCargoVectorProps {
  className?: string
}

/**
 * Architectural Blender-style vector line illustration of a modern Indian
 * commercial multi-axle freight truck (Tata LPT / BharatBenz COE profile)
 * engineered for the Northeast India highway corridor.
 *
 * Adheres strictly to Nordic Lagom principles:
 * - Pure vector line geometry with high-contrast crisp strokes
 * - Technical precision without photorealistic clutter
 * - Restrained palette: near-white strokes, flat muted fills, amber accent
 */
export function IndianCargoVector({ className }: IndianCargoVectorProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-white/10 bg-black/35 p-4 sm:p-5 select-none",
        className
      )}
      aria-label="Blender line illustration of TAC-XPRESS Indian commercial multi-axle freight linehaul truck"
      role="img"
    >
      {/* Technical Blueprint Metadata Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-primary shrink-0" aria-hidden="true" />
          <span className="font-semibold uppercase tracking-wider text-zinc-100">
            FLEET / IN-COE 2825.T LINEHAUL
          </span>
        </div>
        <span className="hidden sm:inline-block tracking-widest text-zinc-500 text-[9px]">
          HIMALAYAN PASS CLEARED
        </span>
      </div>

      {/* Main Vector Illustration */}
      <div className="relative my-3 sm:my-4 w-full" style={{ aspectRatio: "16/9" }}>
        <svg
          viewBox="0 0 800 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="v2-cab-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2840" />
              <stop offset="100%" stopColor="#1a1830" />
            </linearGradient>
            <linearGradient id="v2-container-side" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#252338" />
              <stop offset="100%" stopColor="#181628" />
            </linearGradient>
            <linearGradient id="v2-container-roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#343050" />
              <stop offset="100%" stopColor="#28263c" />
            </linearGradient>
            <linearGradient id="v2-wheel-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1b2c" />
              <stop offset="100%" stopColor="#100f1c" />
            </linearGradient>
          </defs>

          {/* Ground line */}
          <line x1="30" y1="400" x2="770" y2="400" stroke="white" strokeWidth="1" strokeOpacity="0.12" />
          {/* Road center dashes */}
          {[120, 230, 340, 450, 560, 670].map((x) => (
            <line key={x} x1={x} y1="416" x2={x + 60} y2="416" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.6" />
          ))}
          {/* Chassis shadow ellipse */}
          <ellipse cx="440" cy="408" rx="280" ry="10" fill="black" fillOpacity="0.45" />

          {/* Chassis frame rail */}
          <rect x="155" y="355" width="510" height="16" fill="#14131f" stroke="white" strokeOpacity="0.22" strokeWidth="1.5" />

          {/* Fuel tank */}
          <rect x="310" y="358" width="90" height="30" rx="3" fill="#1e1d2c" stroke="white" strokeOpacity="0.28" strokeWidth="1.25" />
          <line x1="336" y1="358" x2="336" y2="388" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="374" y1="358" x2="374" y2="388" stroke="white" strokeOpacity="0.18" strokeWidth="1" />

          {/* Underrun guard */}
          <line x1="290" y1="378" x2="480" y2="378" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
          <line x1="290" y1="386" x2="480" y2="386" stroke="white" strokeOpacity="0.35" strokeWidth="2" />

          {/* Rear tandem drive axle 1 */}
          <g transform="translate(530, 382)">
            <circle r="32" fill="url(#v2-wheel-fill)" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
            <circle r="21" fill="#141320" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle r="11" fill="#100f1c" stroke="white" strokeOpacity="0.25" strokeWidth="1.25" />
            <circle r="3.5" fill="white" fillOpacity="0.6" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 16}
                cy={Math.sin((deg * Math.PI) / 180) * 16}
                r="2"
                fill="white"
                fillOpacity="0.45"
              />
            ))}
          </g>
          {/* Rear drive axle 2 */}
          <g transform="translate(610, 382)">
            <circle r="32" fill="url(#v2-wheel-fill)" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
            <circle r="21" fill="#141320" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle r="11" fill="#100f1c" stroke="white" strokeOpacity="0.25" strokeWidth="1.25" />
            <circle r="3.5" fill="white" fillOpacity="0.6" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 16}
                cy={Math.sin((deg * Math.PI) / 180) * 16}
                r="2"
                fill="white"
                fillOpacity="0.45"
              />
            ))}
          </g>
          {/* Rear axle beam */}
          <line x1="498" y1="382" x2="642" y2="382" stroke="white" strokeOpacity="0.3" strokeWidth="3" />

          {/* Front steer axle */}
          <g transform="translate(205, 382)">
            <circle r="32" fill="url(#v2-wheel-fill)" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
            <circle r="21" fill="#141320" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle r="11" fill="#100f1c" stroke="white" strokeOpacity="0.25" strokeWidth="1.25" />
            <circle r="3.5" fill="white" fillOpacity="0.6" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 16}
                cy={Math.sin((deg * Math.PI) / 180) * 16}
                r="2"
                fill="white"
                fillOpacity="0.45"
              />
            ))}
          </g>
          <line x1="175" y1="382" x2="237" y2="382" stroke="white" strokeOpacity="0.3" strokeWidth="3" />

          {/* Freight container roof panel (isometric) */}
          <polygon
            points="275,120 670,120 658,145 275,145"
            fill="url(#v2-container-roof)"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1.75"
          />
          {/* Container side wall */}
          <rect
            x="275"
            y="145"
            width="383"
            height="210"
            fill="url(#v2-container-side)"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          {/* Corrugation ribs */}
          {Array.from({ length: 13 }, (_, i) => {
            const x = 302 + i * 26
            return (
              <g key={`rib-${i}`}>
                <line x1={x} y1="147" x2={x} y2="353" stroke="black" strokeWidth="3" strokeOpacity="0.7" />
                <line x1={x + 2} y1="147" x2={x + 2} y2="353" stroke="white" strokeOpacity="0.14" strokeWidth="1" />
              </g>
            )
          })}
          {/* Brand logotype */}
          <g transform="translate(335, 210)">
            <rect x="0" y="0" width="210" height="52" fill="#0f0e1a" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
            <text
              x="105"
              y="33"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono, ui-monospace, monospace)"
              fontSize="19"
              fontWeight="700"
              letterSpacing="0.2em"
              fill="white"
              fillOpacity="0.9"
            >
              TAC-XPRESS
            </text>
            <text
              x="105"
              y="46"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono, ui-monospace, monospace)"
              fontSize="7.5"
              letterSpacing="0.22em"
              fill="white"
              fillOpacity="0.38"
            >
              SCHEDULED NORTHEAST LINEHAUL
            </text>
          </g>
          {/* Reflective safety tape */}
          <line x1="275" y1="350" x2="658" y2="350" stroke="#f59e0b" strokeWidth="3" strokeDasharray="16 6" strokeOpacity="0.85" />
          {/* Corner castings */}
          {([[275, 145], [649, 145], [275, 347], [649, 347]] as [number, number][]).map(([cx, cy], i) => (
            <rect key={i} x={cx - 1} y={cy - 1} width="10" height="11" fill="#2e2b42" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
          ))}

          {/* Wind deflector sun visor */}
          <polygon
            points="155,150 273,150 273,180 142,180"
            fill="#2a2840"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <line x1="165" y1="162" x2="260" y2="162" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="160" y1="172" x2="260" y2="172" stroke="white" strokeOpacity="0.12" strokeWidth="1" />

          {/* Cab body shell */}
          <path
            d="M140 180 H273 V368 H136 L130 325 L140 180 Z"
            fill="url(#v2-cab-body)"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="2"
          />

          {/* Windscreen */}
          <path
            d="M143 192 H268 V270 H143 Z"
            fill="#0d0c1a"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <line x1="206" y1="192" x2="206" y2="270" stroke="white" strokeOpacity="0.2" strokeWidth="1.25" />
          {/* Wipers */}
          <line x1="150" y1="268" x2="178" y2="220" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="218" y1="268" x2="250" y2="220" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Glass tint */}
          <path d="M143 192 H268 V220 H143 Z" fill="#735697" fillOpacity="0.08" />

          {/* Side window strip */}
          <rect x="134" y="195" width="7" height="50" rx="1" fill="#0d0c1a" stroke="white" strokeOpacity="0.3" strokeWidth="1" />

          {/* Left mirror */}
          <rect x="119" y="198" width="9" height="38" rx="1.5" fill="#14131f" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
          <line x1="128" y1="207" x2="140" y2="207" stroke="white" strokeOpacity="0.3" strokeWidth="1.25" />
          <line x1="128" y1="230" x2="140" y2="230" stroke="white" strokeOpacity="0.3" strokeWidth="1.25" />

          {/* Grille */}
          <rect x="132" y="280" width="136" height="50" fill="#0d0c1a" stroke="white" strokeOpacity="0.4" strokeWidth="1.25" />
          {[288, 297, 306, 315, 322].map((y) => (
            <line key={y} x1="136" y1={y} x2="263" y2={y} stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
          ))}
          {/* Brand badge on grille */}
          <g transform="translate(186, 289)">
            <rect x="0" y="0" width="24" height="15" fill="#735697" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
            <path d="M5 8 L10 12 L19 4" stroke="white" strokeWidth="1.5" strokeLinecap="square" fill="none" />
          </g>

          {/* Front bumper */}
          <rect x="126" y="334" width="146" height="24" fill="#191726" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" />
          <circle cx="148" cy="346" r="5" fill="#1e1d2c" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="252" cy="346" r="5" fill="#1e1d2c" stroke="white" strokeOpacity="0.4" strokeWidth="1" />

          {/* Headlamp */}
          <rect x="133" y="330" width="20" height="18" fill="white" fillOpacity="0.85" stroke="white" strokeOpacity="0.6" strokeWidth="1.25" />
          <line x1="143" y1="330" x2="143" y2="348" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          {/* Amber blinker */}
          <rect x="116" y="332" width="9" height="14" fill="#f59e0b" fillOpacity="0.9" />

          {/* Telemetry labels */}
          <g fontFamily="var(--font-ibm-plex-mono, ui-monospace, monospace)" fontSize="9.5">
            <g transform="translate(50, 86)">
              <line x1="28" y1="16" x2="58" y2="16" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="58" y1="16" x2="80" y2="46" stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 2" />
              <text x="0" y="11" fill="white" fillOpacity="0.75" fontWeight="600">ORIGIN: DEL-HUB-01</text>
              <text x="0" y="23" fill="white" fillOpacity="0.35">28.5562&#176; N, 77.1000&#176; E</text>
            </g>
            <g transform="translate(548, 70)">
              <line x1="0" y1="16" x2="30" y2="16" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="0" y1="16" x2="-24" y2="46" stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 2" />
              <text x="36" y="11" fill="white" fillOpacity="0.75" fontWeight="600">DEST: IMF-TERMINAL</text>
              <text x="36" y="23" fill="white" fillOpacity="0.35">24.8170&#176; N, 93.9368&#176; E</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Technical Spec Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-3 font-mono text-[10px]">
        <div>
          <span className="block text-[8.5px] uppercase tracking-wider text-zinc-500">Chassis</span>
          <span className="font-semibold text-zinc-100">IN-COE 2825.T Multi-Axle</span>
        </div>
        <div>
          <span className="block text-[8.5px] uppercase tracking-wider text-zinc-500">Payload</span>
          <span className="font-semibold text-zinc-100">24,000 KG / Sealed</span>
        </div>
        <div>
          <span className="block text-[8.5px] uppercase tracking-wider text-zinc-500">Pass Routing</span>
          <span className="font-semibold text-zinc-100">Siliguri â†” Imphal</span>
        </div>
        <div>
          <span className="block text-[8.5px] uppercase tracking-wider text-zinc-500">Telemetry</span>
          <span className="font-semibold text-emerald-400">Digital Lock Intact</span>
        </div>
      </div>
    </div>
  )
}
