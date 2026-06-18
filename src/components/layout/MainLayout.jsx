export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              C
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-emerald-300">
              EcoTrack
            </h1>
          </div>
          <nav>
            <ul className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <li><a href="#understand" className="hover:text-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1">Understand</a></li>
              <li><a href="#track" className="hover:text-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1">Track & Reduce</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        {children}
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} EcoTrack Hackathon Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
