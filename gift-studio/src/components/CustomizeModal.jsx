import { useState, useEffect, useRef } from "react";
import { Check, Sparkles, ImagePlus, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { INK_COLORS, METAL_FINISHES } from "../data/products";

const MAX_FILE_MB = 5;
const BASE_W = 280;
const BASE_H = 210;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function shorten(s, n) {
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > n ? one.slice(0, n - 1) + "…" : one;
}

// Longer text gets a smaller font so it still fits the preview
function tierOf(len) {
  return len <= 14 ? 0 : len <= 40 ? 1 : 2;
}

// Small compressed copy of the photo, safe to keep inside the cart
function makeThumb(img) {
  const scale = Math.min(1, 200 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

function Stage({ children }) {
  return (
    <div
      style={{ width: BASE_W, height: BASE_H }}
      className="flex items-center justify-center"
    >
      {children}
    </div>
  );
}

/* Live preview. Drawn at a fixed 280 x 210 size, then scaled where needed. */
function GiftPreview({ kind, text, color, photoSrc, glow }) {
  const t = tierOf(text.length);
  const shown = text.trim();

  if (kind === "neon") {
    return (
      <Stage>
        <div
          style={{ width: 260, height: 150 }}
          className="bg-gray-900 rounded-xl flex items-center justify-center px-5 overflow-hidden"
        >
          <p
            style={{
              color,
              fontSize: [38, 26, 18][t],
              lineHeight: 1.15,
              textShadow: `0 0 8px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
            }}
            className="font-bold text-center break-words whitespace-pre-line"
          >
            {shown || "Your text"}
          </p>
        </div>
      </Stage>
    );
  }

  if (kind === "mug") {
    return (
      <Stage>
        <div className="relative" style={{ width: 170, height: 140, marginRight: 34 }}>
          <div className="absolute inset-0 bg-white rounded-b-3xl rounded-t-lg border-2 border-gray-200 shadow-lg overflow-hidden">
            {photoSrc ? (
              <>
                <img src={photoSrc} alt="" className="w-full h-full object-cover" />
                {shown && (
                  <p
                    style={{ color, fontSize: [15, 12, 10][t], maxHeight: 70 }}
                    className="absolute inset-x-0 bottom-0 bg-white/85 px-2 py-1 text-center font-bold break-words whitespace-pre-line overflow-hidden"
                  >
                    {shown}
                  </p>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center px-4">
                <p
                  style={{ color, fontSize: [22, 16, 12][t] }}
                  className="font-bold text-center break-words whitespace-pre-line"
                >
                  {shown || "Your text"}
                </p>
              </div>
            )}
          </div>
          <div className="absolute -right-8 top-8 w-10 h-20 border-8 border-gray-200 rounded-r-full" />
        </div>
      </Stage>
    );
  }

  if (kind === "cushion") {
    const dark = glow && !photoSrc;
    return (
      <Stage>
        <div
          style={{ width: 190, height: 190 }}
          className={
            "relative rounded-3xl shadow-xl overflow-hidden border " +
            (dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")
          }
        >
          {photoSrc ? (
            <>
              <img src={photoSrc} alt="" className="w-full h-full object-cover" />
              {shown && (
                <p
                  style={{ color, fontSize: [16, 13, 11][t], maxHeight: 80 }}
                  className="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-1.5 text-center font-bold break-words whitespace-pre-line overflow-hidden"
                >
                  {shown}
                </p>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center px-5">
              <p
                style={{
                  color,
                  fontSize: [30, 22, 16][t],
                  textShadow: glow ? `0 0 8px ${color}, 0 0 20px ${color}` : "none",
                }}
                className="font-bold text-center break-words whitespace-pre-line"
              >
                {shown || "Your text"}
              </p>
            </div>
          )}
        </div>
      </Stage>
    );
  }

  if (kind === "frame") {
    return (
      <Stage>
        <div className="bg-amber-800 p-2.5 rounded shadow-xl" style={{ width: 200 }}>
          <div className="bg-white p-1.5">
            <div
              style={{ height: 120 }}
              className="bg-gray-100 flex items-center justify-center overflow-hidden"
            >
              {photoSrc ? (
                <img src={photoSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <p className="text-[10px] text-gray-400 px-3 text-center">Your photo here</p>
              )}
            </div>
            {shown && (
              <p
                style={{ color, fontSize: [13, 11, 9][t], maxHeight: 40 }}
                className="mt-1.5 text-center font-bold break-words whitespace-pre-line overflow-hidden"
              >
                {shown}
              </p>
            )}
          </div>
        </div>
      </Stage>
    );
  }

  if (kind === "keychain") {
    return (
      <Stage>
        <div className="flex flex-col items-center">
          <div
            className="w-9 h-9 rounded-full border-4"
            style={{ borderColor: "#6b7280" }}
          />
          <div
            className="w-3 h-4 -mt-1 border-2 rounded"
            style={{ borderColor: "#6b7280" }}
          />
          <div
            className="rounded-2xl shadow-lg overflow-hidden border-4 flex flex-col items-center justify-center"
            style={{ width: 150, height: 120, borderColor: color, background: color + "33" }}
          >
            {photoSrc ? (
              <>
                <img
                  src={photoSrc}
                  alt=""
                  className="w-full object-cover"
                  style={{ height: 72 }}
                />
                {shown && (
                  <p
                    style={{ color: "#374151", fontSize: [12, 10, 9][t], maxHeight: 34 }}
                    className="px-2 pt-1 text-center font-bold break-words whitespace-pre-line overflow-hidden"
                  >
                    {shown}
                  </p>
                )}
              </>
            ) : (
              <p
                style={{ color: "#374151", fontSize: [18, 14, 11][t] }}
                className="px-3 text-center font-bold break-words whitespace-pre-line"
              >
                {shown || "Your text"}
              </p>
            )}
          </div>
        </div>
      </Stage>
    );
  }

  if (kind === "necklace") {
    const size = shown.length <= 6 ? 22 : shown.length <= 9 ? 18 : 14;
    return (
      <Stage>
        <svg viewBox="0 0 280 210" width={BASE_W} height={BASE_H}>
          <path
            d="M40 20 Q140 190 240 20"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="1 5"
            strokeLinecap="round"
          />
          <circle cx="140" cy="108" r="4" fill="none" stroke={color} strokeWidth="2" />
          <rect
            x="75"
            y="114"
            width="130"
            height="46"
            rx="10"
            fill={color}
            fillOpacity="0.25"
            stroke={color}
            strokeWidth="3"
          />
          <text
            x="140"
            y="144"
            textAnchor="middle"
            fontSize={size}
            fontStyle="italic"
            fontWeight="700"
            fill="#3f3f46"
            fontFamily="serif"
          >
            {shown || "Name"}
          </text>
        </svg>
      </Stage>
    );
  }

  if (kind === "lamp") {
    return (
      <Stage>
        <div className="relative flex flex-col items-center">
          <div
            className="absolute rounded-full blur-2xl left-1/2 -translate-x-1/2"
            style={{ width: 210, height: 120, top: 0, background: color, opacity: 0.35 }}
          />
          <div
            className="relative overflow-hidden"
            style={{
              width: 150,
              height: 100,
              clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)",
              background: color + "66",
            }}
          >
            {photoSrc ? (
              <img src={photoSrc} alt="" className="w-full h-full object-cover opacity-90" />
            ) : (
              <div className="w-full h-full flex items-center justify-center px-8">
                <p
                  style={{ color: "#1f2937", fontSize: [14, 11, 9][t] }}
                  className="font-bold text-center break-words whitespace-pre-line overflow-hidden"
                >
                  {shown || "Your text"}
                </p>
              </div>
            )}
          </div>
          <div className="relative w-2 h-7 bg-gray-500" />
          <div className="relative w-20 h-2.5 rounded-full bg-gray-600" />
          {photoSrc && shown && (
            <p
              style={{ color, fontSize: [14, 11, 9][t], maxHeight: 44 }}
              className="relative mt-2 px-4 text-center font-bold break-words whitespace-pre-line overflow-hidden"
            >
              {shown}
            </p>
          )}
        </div>
      </Stage>
    );
  }

  if (kind === "caricature") {
    return (
      <Stage>
        <div
          className="relative bg-white border-4 border-amber-900 p-2 shadow-xl"
          style={{ width: 150 }}
        >
          <div
            className="bg-orange-50 overflow-hidden flex items-end justify-center"
            style={{ height: 130 }}
          >
            {photoSrc ? (
              <img src={photoSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 100 100" className="w-24 h-24 text-orange-300">
                <circle cx="50" cy="38" r="20" fill="currentColor" />
                <path d="M12 100 Q16 66 50 62 Q84 66 88 100 Z" fill="currentColor" />
              </svg>
            )}
          </div>
          {shown && (
            <p
              style={{ color, fontSize: [13, 11, 9][t], maxHeight: 36 }}
              className="mt-1 text-center font-bold break-words whitespace-pre-line overflow-hidden"
            >
              {shown}
            </p>
          )}
          {photoSrc && (
            <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
              Your reference
            </span>
          )}
        </div>
      </Stage>
    );
  }

  return (
    <Stage>
      <p className="text-gray-500">{shown || "Your text"}</p>
    </Stage>
  );
}

function ScaledPreview({ width, ...props }) {
  const scale = width / BASE_W;
  return (
    <div style={{ width, height: BASE_H * scale }} className="overflow-hidden">
      <div
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <GiftPreview {...props} />
      </div>
    </div>
  );
}

export default function CustomizeModal({ product, onClose }) {
  const c = product.custom;
  const palette = c.palette === "metal" ? METAL_FINISHES : INK_COLORS;
  const colorLabel = c.colorLabel || (c.palette === "metal" ? "Finish" : "Colour");
  const textRequired = c.textRequired !== false;
  const needsPhoto = c.photo === "required";
  const photoAllowed = c.photo !== "none";

  const [text, setText] = useState(c.defaultText);
  const [color, setColor] = useState(palette[0].value);
  const [photo, setPhoto] = useState(null); // { src, thumb, id }
  const [photoError, setPhotoError] = useState("");
  const [gift, setGift] = useState(null); // snapshot of what was just added
  // stage: 0 closed box, 1 lid off, 2 gift out, 3 details visible
  const [stage, setStage] = useState(0);

  const { cart, addToCart, totalItems, totalPrice } = useCart();

  const fileInputRef = useRef(null);
  const photoRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  const colorName = (palette.find((p) => p.value === color) || palette[0]).name;
  const canAdd = (!textRequired || text.trim() !== "") && (!needsPhoto || photo);

  // Lock page scroll, focus the dialog, close on Esc
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (dialogRef.current) dialogRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Free the browser memory used by the photo when the dialog closes
  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);
  useEffect(() => {
    return () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.src);
    };
  }, []);

  // Unwrap animation timeline
  useEffect(() => {
    if (!gift) return;
    const timers = [];
    if (!prefersReducedMotion()) {
      timers.push(setTimeout(() => setStage(1), 500));
      timers.push(setTimeout(() => setStage(2), 1000));
      timers.push(setTimeout(() => setStage(3), 1700));
    }
    return () => timers.forEach(clearTimeout);
  }, [gift]);

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setPhotoError(`That image is too large. Please keep it under ${MAX_FILE_MB} MB.`);
      return;
    }

    setPhotoError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.src);
      setPhoto({ src: url, thumb: makeThumb(img), id: Date.now().toString(36) });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setPhotoError("We could not read that image. Please try a different one.");
    };
    img.src = url;
  }

  function removePhoto() {
    if (photo) URL.revokeObjectURL(photo.src);
    setPhoto(null);
    setPhotoError("");
  }

  function confirmAdd() {
    const shown = text.trim();
    const item = {
      id: `${product.id}|${color}|${shown}|${photo ? photo.id : "-"}`,
      productId: product.id,
      name:
        product.name +
        (photo ? " + photo" : "") +
        (shown ? `: "${shorten(shown, 24)}"` : ""),
      price: product.price,
      category: product.category,
      thumb: photo ? photo.thumb : undefined,
    };
    addToCart(item);
    setGift({ item, text: shown, color, photoSrc: photo ? photo.src : null });
    setStage(prefersReducedMotion() ? 3 : 0);
  }

  function customizeAnother() {
    setGift(null);
    setStage(0);
  }

  const qtyInCart = gift
    ? (cart.find((i) => i.id === gift.item.id) || {}).quantity || 1
    : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-title"
      className="fixed inset-0 z-[60] bg-black/60 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div
          ref={dialogRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-4xl p-5 sm:p-8 outline-none"
        >
          {!gift ? (
            <>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    {product.category}
                  </p>
                  <h3 id="customize-title" className="text-2xl font-bold text-green-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">₹{product.price}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-10 h-10 shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Live preview */}
                <div className="rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center overflow-hidden min-h-[16rem] md:min-h-[22rem] p-4">
                  <div className="origin-center scale-100 md:scale-[1.2]">
                    <GiftPreview
                      kind={c.kind}
                      glow={c.glow}
                      text={text}
                      color={color}
                      photoSrc={photo ? photo.src : null}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  {photoAllowed && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        {needsPhoto ? "Your photo" : "Your photo (optional)"}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-green-800 text-sm text-green-800 hover:bg-green-50 transition-colors"
                        >
                          <ImagePlus className="w-4 h-4" />
                          {photo ? "Change photo" : "Upload a photo"}
                        </button>
                        {photo && (
                          <>
                            <img
                              src={photo.thumb}
                              alt="Your uploaded photo"
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                      {photoError && <p className="text-xs text-red-600 mt-2">{photoError}</p>}
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG or WEBP, up to {MAX_FILE_MB} MB.
                        {product.custom.kind === "caricature" &&
                          " Our artist draws your caricature from this photo."}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">{c.textLabel}</p>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={c.maxChars}
                      rows={c.maxChars > 40 ? 3 : 2}
                      placeholder="Type here"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-800 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {text.length}/{c.maxChars} characters
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {colorLabel}: <span className="font-normal text-gray-500">{colorName}</span>
                    </p>
                    <div className="flex gap-3">
                      {palette.map((p) => (
                        <button
                          key={p.value}
                          aria-label={p.name}
                          onClick={() => setColor(p.value)}
                          style={{ backgroundColor: p.value }}
                          className={
                            "w-9 h-9 rounded-full border-2 transition-transform " +
                            (color === p.value ? "border-gray-900 scale-110" : "border-white shadow")
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={confirmAdd}
                      disabled={!canAdd}
                      className="w-full sm:w-auto px-7 py-3 bg-green-800 text-white rounded-full text-sm hover:bg-green-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add to cart · ₹{product.price}
                    </button>
                    {needsPhoto && !photo && (
                      <p className="text-xs text-gray-500 mt-2">Upload a photo to continue.</p>
                    )}
                    {textRequired && text.trim() === "" && (
                      <p className="text-xs text-gray-500 mt-2">Type a message to continue.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              {/* Unwrap animation */}
              <div className="relative mx-auto" style={{ width: 240, height: 240 }}>
                <div
                  className="absolute rounded-full bg-orange-200 blur-2xl"
                  style={{
                    left: 40,
                    bottom: 90,
                    width: 160,
                    height: 120,
                    zIndex: 0,
                    opacity: stage >= 2 ? 0.8 : 0,
                    transition: "opacity 600ms ease",
                  }}
                />

                <Sparkles
                  className="absolute text-orange-500 w-5 h-5"
                  style={{
                    left: 18,
                    top: 36,
                    zIndex: 4,
                    opacity: stage >= 2 ? 1 : 0,
                    transform: stage >= 2 ? "scale(1)" : "scale(0)",
                    transition: "all 500ms ease 200ms",
                  }}
                />
                <Sparkles
                  className="absolute text-green-700 w-4 h-4"
                  style={{
                    right: 20,
                    top: 58,
                    zIndex: 4,
                    opacity: stage >= 2 ? 1 : 0,
                    transform: stage >= 2 ? "scale(1)" : "scale(0)",
                    transition: "all 500ms ease 350ms",
                  }}
                />

                {/* The customized gift rises out from behind the box */}
                <div
                  className="absolute"
                  style={{
                    left: 50,
                    bottom: 10,
                    width: 140,
                    height: 105,
                    zIndex: 1,
                    transform:
                      stage >= 2 ? "translateY(-108px) scale(1)" : "translateY(0) scale(0.9)",
                    opacity: stage >= 2 ? 1 : 0,
                    transition:
                      "transform 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 300ms ease",
                  }}
                >
                  <ScaledPreview
                    width={140}
                    kind={c.kind}
                    glow={c.glow}
                    text={gift.text}
                    color={gift.color}
                    photoSrc={gift.photoSrc}
                  />
                </div>

                {/* Box body */}
                <div
                  className="absolute bg-green-800 rounded-b-xl"
                  style={{ left: 40, bottom: 0, width: 160, height: 100, zIndex: 2 }}
                >
                  <div
                    className="absolute top-0 h-full bg-orange-500"
                    style={{ left: "50%", width: 22, transform: "translateX(-50%)" }}
                  />
                </div>

                {/* Box lid (lifts, tilts and fades away) */}
                <div
                  className="absolute bg-green-700 rounded-md"
                  style={{
                    left: 32,
                    bottom: 100,
                    width: 176,
                    height: 30,
                    zIndex: 3,
                    transformOrigin: "center bottom",
                    transform:
                      stage >= 1
                        ? "translateY(-48px) rotate(-14deg)"
                        : "translateY(0) rotate(0deg)",
                    opacity: stage >= 1 ? 0 : 1,
                    transition: "transform 600ms ease, opacity 500ms ease 100ms",
                  }}
                >
                  <div
                    className="absolute top-0 h-full bg-orange-500"
                    style={{ left: "50%", width: 22, transform: "translateX(-50%)" }}
                  />
                </div>
              </div>

              {/* What was added to the cart */}
              <div
                style={{
                  opacity: stage >= 3 ? 1 : 0,
                  transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
                  transition: "all 500ms ease",
                  pointerEvents: stage >= 3 ? "auto" : "none",
                }}
              >
                <h3 id="customize-title" className="text-2xl font-bold text-green-900">
                  Your gift is wrapped!
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Here&apos;s what we added to your cart:
                </p>

                <div className="mt-4 flex items-center gap-3 text-left border border-green-200 bg-green-50 rounded-xl p-3">
                  <div className="shrink-0 rounded-md overflow-hidden bg-white">
                    <ScaledPreview
                      width={72}
                      kind={c.kind}
                      glow={c.glow}
                      text={gift.text}
                      color={gift.color}
                      photoSrc={gift.photoSrc}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-green-900 truncate">
                      {gift.item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{gift.item.price} · Qty {qtyInCart}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-700 text-xs font-semibold shrink-0">
                    <span
                      className="w-5 h-5 rounded-full bg-green-700 text-white flex items-center justify-center"
                      style={{
                        transform: stage >= 3 ? "scale(1)" : "scale(0)",
                        transition: "transform 400ms cubic-bezier(0.2, 0.9, 0.3, 1.4) 200ms",
                      }}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Added
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Your cart now has {totalItems} item{totalItems === 1 ? "" : "s"} · ₹{totalPrice}
                </p>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={customizeAnother}
                    className="px-6 py-2.5 rounded-full border border-gray-300 text-sm hover:border-green-800 transition-colors"
                  >
                    Customize another
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-green-800 text-white text-sm hover:bg-green-900 transition-colors"
                  >
                    Back to shop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}