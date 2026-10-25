import { useState } from "react";
import { Sparkles } from "lucide-react";
import ProductImage from "./ProductImage";

const QUESTIONS = [
  {
    key: "who",
    title: "Who is the gift for?",
    options: [
      { label: "Partner", value: "partner" },
      { label: "Friend", value: "friend" },
      { label: "Parent", value: "parent" },
      { label: "Myself", value: "self" },
    ],
  },
  {
    key: "occasion",
    title: "What's the occasion?",
    options: [
      { label: "Birthday", value: "birthday" },
      { label: "Anniversary", value: "anniversary" },
      { label: "Housewarming", value: "housewarming" },
      { label: "Just because", value: "justbecause" },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    options: [
      { label: "Up to ₹500", value: 500 },
      { label: "Up to ₹1000", value: 1000 },
      { label: "Up to ₹2000", value: 2000 },
      { label: "No limit", value: 999999 },
    ],
  },
];

function getResults(products, { who, occasion, budget }) {
  return products
    .filter((p) => p.price <= budget)
    .map((p) => ({
      ...p,
      score:
        (p.forWho.includes(who) ? 2 : 0) +
        (p.occasions.includes(occasion) ? 1 : 0),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, 3);
}

export default function GiftFinder({ products, onCustomize }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const done = step >= QUESTIONS.length;
  const current = QUESTIONS[step];
  const results = done ? getResults(products, answers) : [];

  function choose(key, value) {
    setAnswers({ ...answers, [key]: value });
    setStep(step + 1);
  }

  function back() {
    setStep(step - 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  return (
    <section id="finder" className="bg-orange-50 py-16">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <p className="text-xs tracking-widest uppercase font-semibold">Gift Finder</p>
        </div>
        <h2 className="text-3xl font-bold text-green-900 text-center mb-10">
          Not sure what to gift? Answer 3 quick questions.
        </h2>

        <div className="bg-white rounded-2xl border border-orange-200 p-6 sm:p-8">
          {!done ? (
            <>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                {step > 0 && (
                  <button onClick={back} className="hover:text-green-800">
                    ← Back
                  </button>
                )}
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full mb-6">
                <div
                  className="h-1.5 bg-green-800 rounded-full transition-all"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl font-semibold text-green-900 mb-5">{current.title}</h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {current.options.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => choose(current.key, o.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-left hover:border-green-800 hover:bg-green-50 transition-colors"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-green-900 mb-5">
                {results.length > 0
                  ? "Our top picks for you"
                  : products.length === 0
                    ? "Products are not available right now"
                    : "No match found"}
              </h3>

              {results.length === 0 && products.length > 0 && (
                <p className="text-gray-600 mb-5">
                  Nothing fits that combination yet. Try a higher budget or a different occasion.
                </p>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                {results.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="h-28 rounded-lg mb-3 overflow-hidden bg-orange-50">
                      <ProductImage category={p.category} name={p.name} />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">{p.category}</p>
                    <h4 className="font-semibold text-green-900 mt-1 text-sm">{p.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">₹{p.price}</p>
                    <button
                      onClick={() => onCustomize(p.id)}
                      className="mt-3 w-full py-2 bg-green-800 text-white rounded-full text-xs hover:bg-green-900 transition-colors"
                    >
                      Customize &amp; add
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={restart}
                className="mt-6 text-sm text-gray-500 hover:text-green-800"
              >
                ↺ Start over
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}