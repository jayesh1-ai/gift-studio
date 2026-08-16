export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-bold text-green-800">Tagged & Wrapped</p>
        <p className="text-sm text-gray-500">
          Personalized gifts, made in small batches.
        </p>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Tagged & Wrapped
        </p>
      </div>
    </footer>
  );
}