const STEPS = [
  {
    number: "01",
    title: "Choose a piece",
    description: "Browse the shop and pick the item that fits the moment.",
  },
  {
    number: "02",
    title: "Add your touch",
    description: "Type a name, a date, or a short note. See it update live.",
  },
  {
    number: "03",
    title: "We wrap and ship",
    description: "Every order is cut, printed, and packed by hand before it goes out.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-green-50 py-16">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-green-900 mb-10 text-center">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <p className="text-4xl font-bold text-orange-300 mb-3">
                {step.number}
              </p>
              <h3 className="font-semibold text-green-900 text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}