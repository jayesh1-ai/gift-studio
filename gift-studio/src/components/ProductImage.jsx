import { useState } from "react";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pickArt(category, name) {
  if (category === "Home Decor") return /lamp/i.test(name) ? "Lamp" : "Frame";
  if (category === "Cushions" && /led/i.test(name)) return "LedCushion";
  if (category === "Mugs" && /couple/i.test(name)) return "CoupleMugs";
  return category;
}

// Soft ground shadow shared by most illustrations
function Shadow() {
  return <ellipse cx="100" cy="124" rx="42" ry="4.5" fill="#1f2937" opacity="0.08" />;
}

/*
  Minimal flat illustrations (viewBox 200 x 140).
  The "pi-..." classes are animated on hover from index.css.
*/
function Art({ kind }) {
  switch (kind) {
    case "Cushions":
      return (
        <>
          <rect width="200" height="140" fill="#fbf1e4" />
          <Shadow />
          <g className="pi-pop">
            <rect x="58" y="30" width="84" height="84" rx="24" fill="#e8a56d" />
            <rect
              x="66"
              y="38"
              width="68"
              height="68"
              rx="18"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <circle cx="100" cy="72" r="4" fill="#c97f45" />
          </g>
        </>
      );

    case "Mugs":
      return (
        <>
          <rect width="200" height="140" fill="#edf4ef" />
          <Shadow />
          <g fill="none" stroke="#a9bbb0" strokeWidth="2.5" strokeLinecap="round">
            <path className="pi-steam" style={{ animationDelay: "0s" }} d="M86 40 Q81 32 86 24" />
            <path className="pi-steam" style={{ animationDelay: "0.25s" }} d="M100 40 Q95 31 100 22" />
            <path className="pi-steam" style={{ animationDelay: "0.5s" }} d="M114 40 Q109 32 114 24" />
          </g>
          <path
            d="M130 62 H140 Q154 62 154 78 Q154 94 140 94 H130"
            fill="none"
            stroke="#2f6b4f"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="M64 48 H136 V100 Q136 120 116 120 H84 Q64 120 64 100 Z" fill="#2f6b4f" />
          <rect x="64" y="70" width="72" height="8" fill="#f5efe3" opacity="0.9" />
        </>
      );

    case "LedCushion":
      return (
        <>
          <rect width="200" height="140" fill="#1f242c" />
          <g className="pi-pop">
            <rect x="58" y="30" width="84" height="84" rx="24" fill="#2d3540" />
            <rect
              x="66"
              y="38"
              width="68"
              height="68"
              rx="18"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.12"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <text
              className="pi-led"
              x="100"
              y="86"
              textAnchor="middle"
              fontSize="40"
              fontWeight="700"
              fill="#ffd9a0"
              fontFamily="system-ui, sans-serif"
              style={{ filter: "drop-shadow(0 0 4px #ffc27a) drop-shadow(0 0 10px #ffb05c)" }}
            >
              A
            </text>
          </g>
        </>
      );

    case "CoupleMugs":
      return (
        <>
          <rect width="200" height="140" fill="#edf4ef" />
          <ellipse cx="100" cy="124" rx="68" ry="4.5" fill="#1f2937" opacity="0.08" />
          <g fill="none" stroke="#a9bbb0" strokeWidth="2.5" strokeLinecap="round">
            <path className="pi-steam" style={{ animationDelay: "0s" }} d="M62 46 Q57 38 62 30" />
            <path className="pi-steam" style={{ animationDelay: "0.3s" }} d="M138 46 Q133 38 138 30" />
          </g>
          <path d="M40 68 H34 Q24 68 24 79 Q24 90 34 90 H40" fill="none" stroke="#2f6b4f" strokeWidth="6" strokeLinecap="round" />
          <path d="M40 56 H84 V104 Q84 120 68 120 H56 Q40 120 40 104 Z" fill="#2f6b4f" />
          <rect x="40" y="76" width="44" height="6" fill="#f5efe3" opacity="0.9" />
          <path d="M160 68 H166 Q176 68 176 79 Q176 90 166 90 H160" fill="none" stroke="#c97f45" strokeWidth="6" strokeLinecap="round" />
          <path d="M116 56 H160 V104 Q160 120 144 120 H132 Q116 120 116 104 Z" fill="#c97f45" />
          <rect x="116" y="76" width="44" height="6" fill="#f5efe3" opacity="0.9" />
          <path d="M100 86 C90 78 94 68 100 73 C106 68 110 78 100 86 Z" fill="#e8a56d" />
        </>
      );

    case "Caricatures":
      return (
        <>
          <rect width="200" height="140" fill="#fbefe8" />
          <Shadow />
          <g transform="translate(0 6)">
            <g className="pi-tilt">
              <rect x="68" y="14" width="64" height="94" rx="3" fill="#ffffff" stroke="#c9b79c" strokeWidth="4" />
              <rect x="74" y="20" width="52" height="82" fill="#f6e3d3" />
              <path d="M78 102 Q80 84 100 82 Q120 84 122 102 Z" fill="#2f6b4f" />
              <circle cx="100" cy="64" r="15" fill="#f0c9a4" />
              <path d="M85 62 Q86 46 100 46 Q114 46 115 62 Q106 54 100 55 Q94 54 85 62 Z" fill="#3b2a20" />
              <circle cx="95" cy="66" r="1.6" fill="#3b2a20" />
              <circle cx="105" cy="66" r="1.6" fill="#3b2a20" />
              <path d="M95 72 Q100 76 105 72" fill="none" stroke="#b4553f" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>
        </>
      );

    case "Neon Lights":
      return (
        <>
          <rect width="200" height="140" fill="#181c24" />
          <g
            className="pi-neon"
            style={{ filter: "drop-shadow(0 0 3px #ff6fb5) drop-shadow(0 0 8px #ff4da6)" }}
          >
            <text
              x="100"
              y="78"
              textAnchor="middle"
              fontSize="32"
              fontWeight="700"
              fill="none"
              stroke="#ff8ac4"
              strokeWidth="2"
              letterSpacing="2"
              fontFamily="system-ui, sans-serif"
            >
              Aarav
            </text>
            <path d="M62 94 H138" stroke="#ff8ac4" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </>
      );

    case "Keychains":
      return (
        <>
          <rect width="200" height="140" fill="#edf2f6" />
          <Shadow />
          <g className="pi-swing" style={{ transformOrigin: "100px 20px" }}>
            <circle cx="100" cy="30" r="11" fill="none" stroke="#8a94a0" strokeWidth="4" />
            <rect x="95" y="41" width="10" height="13" rx="4" fill="none" stroke="#8a94a0" strokeWidth="3" />
            <rect x="72" y="54" width="56" height="62" rx="12" fill="#e9c46a" />
            <path d="M100 100 C84 88 90 74 100 82 C110 74 116 88 100 100 Z" fill="#ffffff" fillOpacity="0.9" />
          </g>
        </>
      );

    case "Jewellery":
      return (
        <>
          <rect width="200" height="140" fill="#f8eeec" />
          <g className="pi-sway" style={{ transformOrigin: "100px 16px" }}>
            <path d="M52 16 Q100 120 148 16" fill="none" stroke="#c9a24a" strokeWidth="2" />
            <circle cx="100" cy="71" r="3" fill="none" stroke="#c9a24a" strokeWidth="2" />
            <circle cx="100" cy="88" r="14" fill="#f3d98b" stroke="#c9a24a" strokeWidth="2" />
            <text
              x="100"
              y="93"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#8a6a1f"
              fontFamily="Georgia, serif"
            >
              A
            </text>
          </g>
        </>
      );

    case "Lamp":
      return (
        <>
          <rect width="200" height="140" fill="#f7f1e3" />
          <Shadow />
          <ellipse className="pi-glow" cx="100" cy="64" rx="58" ry="40" fill="#f7d98b" opacity="0.4" />
          <path d="M74 38 L126 38 L140 82 L60 82 Z" fill="#f2d492" />
          <rect x="97" y="82" width="6" height="26" fill="#8b8f96" />
          <rect x="78" y="108" width="44" height="8" rx="4" fill="#6b7078" />
        </>
      );

    case "Frame":
      return (
        <>
          <rect width="200" height="140" fill="#f2efe8" />
          <Shadow />
          <g className="pi-tilt">
            <rect x="56" y="20" width="88" height="94" rx="3" fill="#b98a5c" />
            <rect x="64" y="28" width="72" height="78" fill="#fffdf8" />
            <circle cx="112" cy="50" r="8" fill="#f2c25b" />
            <path d="M64 106 L88 74 L104 92 L116 80 L136 106 Z" fill="#7fa88c" />
          </g>
        </>
      );

    default:
      return (
        <>
          <rect width="200" height="140" fill="#fbf1e4" />
          <Shadow />
          <rect x="62" y="56" width="76" height="58" rx="5" fill="#2f6b4f" />
          <rect x="94" y="56" width="12" height="58" fill="#e8a56d" />
          <rect x="56" y="44" width="88" height="16" rx="4" fill="#3d7d5f" />
          <rect x="94" y="44" width="12" height="16" fill="#e8a56d" />
        </>
      );
  }
}

/*
  Shows a real photo if one exists at /public/products/<product-name>.jpg,
  otherwise shows the minimal illustration for the category.
*/
export default function ProductImage({ category, name, image }) {
  const [failed, setFailed] = useState(false);
  const src = image || `/products/${slugify(name)}.jpg`;

  return (
    <div className="pi-root relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 200 140"
        preserveAspectRatio="xMidYMid slice"
        className="pi-zoom w-full h-full"
        role="img"
        aria-label={name}
        aria-hidden={!failed}
      >
        <Art kind={pickArt(category, name)} />
      </svg>

      {!failed && (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="pi-zoom absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}