export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold text-teal-700">
          MonTrip
        </h1>

        <nav className="hidden gap-8 md:flex">
          <a href="#" className="text-gray-700 hover:text-teal-700">
            Destinations
          </a>

          <a href="#" className="text-gray-700 hover:text-teal-700">
            AI Planner
          </a>

          <a href="#" className="text-gray-700 hover:text-teal-700">
            Routes
          </a>

          <a href="#" className="text-gray-700 hover:text-teal-700">
            Pricing
          </a>
        </nav>

        <button className="rounded-full bg-teal-700 px-6 py-3 text-white transition hover:bg-teal-800">
          Start Planning
        </button>
      </div>
    </header>
  );
}