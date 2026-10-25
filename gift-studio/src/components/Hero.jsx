import { ArrowRight, Sparkles } from "lucide-react";
import ProductImage from "./ProductImage";

const PERKS = ["Every piece personalized", "Live preview before you add", "Gift-wrapped by hand"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute top-0 -right-40 w-[30rem] h-[30rem] rounded-full bg-orange-100 blur-[100px] opacity-60" />
      <div className="pointer-events-none absolute top-10 -left-48 w-[26rem] h-[26rem] rounded-full bg-green-100 blur-[100px] opacity-70" />

      <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-[1.1fr_1fr] gap-14 items-center">
        {/* Text */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-green-800">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Made for one person, not everyone
          </p>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.08] text-green-900">
            Every gift wears
            <br />
            its own{" "}
            <span className="font-serif italic font-normal text-orange-600">name tag.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            Choose a piece, add a name, a date, a handwritten line. We cut, print, and wrap it
            before it leaves the workshop.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-green-800 px-7 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-900 hover:shadow-md"
            >
              Shop &amp; customize
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#finder"
              className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3.5 text-sm font-medium text-green-900 transition hover:border-green-800 hover:bg-white/60"
            >
              Find a gift in 3 questions
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: two product cards behind a hanging gift tag */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-none h-[21rem] sm:h-[25rem]">
          <div className="absolute left-0 top-14 w-32 sm:w-44 aspect-square rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 -rotate-6">
            <ProductImage category="Mugs" name="Photo Mug" />
          </div>

          <div className="absolute right-0 bottom-0 w-32 sm:w-44 aspect-square rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 rotate-6">
            <ProductImage category="Neon Lights" name="Custom Name Neon Sign" />
          </div>

          {/* Hanging tag */}
          <div className="absolute left-[56%] top-0 -translate-x-1/2 flex flex-col items-center">
            <div className="w-px h-12 bg-gray-300" />
            <div className="relative -rotate-3 hover:rotate-0 transition-transform duration-500 w-52 sm:w-60 rounded-2xl bg-white px-5 sm:px-6 pt-9 pb-7 text-center shadow-xl ring-1 ring-black/5">
              <span className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-orange-100 ring-1 ring-orange-200" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">To</p>
              <p className="font-serif italic text-xl sm:text-2xl text-green-800 mt-1">Someone specific</p>
              <div className="my-4 border-t border-dashed border-gray-300" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400">From</p>
              <p className="font-serif italic text-xl sm:text-2xl text-orange-600 mt-1">You, actually caring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}