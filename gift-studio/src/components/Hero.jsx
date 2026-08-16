export default function Hero() {
  return (
    <section id="top" className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-widest uppercase text-orange-600 font-semibold mb-4">
            Made for one person, not everyone
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight">
            Every gift wears its own <span className="italic text-orange-600">name tag.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md">
            Choose a piece, add a name, a date, a handwritten line, we cut,
            print, and wrap it before it leaves the workshop.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#shop" className="px-7 py-3 bg-green-800 text-white rounded-full hover:bg-green-900 transition-colors">
              Browse the shop
            </a>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">To</p>
          <p className="text-2xl italic text-green-800 mt-1">Someone specific</p>
          <div className="my-4 border-t border-dashed border-gray-300" />
          <p className="text-sm uppercase tracking-widest text-gray-500">From</p>
          <p className="text-2xl italic text-orange-600 mt-1">You, actually caring</p>
        </div>
      </div>
    </section>
  );
}