import React from 'react';

export default function ActionPlan({ results, actionPlan }) {
  
  if (!results) {
    return (
      <div className="bg-slate-800/20 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center h-full min-h-[400px] text-center border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4 animate-float" role="img" aria-label="Sprout">
          🌱
        </div>
        <h3 className="text-xl font-semibold text-slate-300">Awaiting Data</h3>
        <p className="text-slate-400 mt-2 max-w-sm">
          Enter your metrics in the tracker to calculate your carbon footprint and receive a personalized reduction plan.
        </p>
      </div>
    );
  }

  const { transportWeekly, energyWeekly, dietWeekly, totalWeekly } = results;

  return (
    <div className="bg-gradient-to-br from-brand-900/40 to-slate-900 border border-brand-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

      <div className="mb-8 border-b border-slate-700/50 pb-8">
        <h3 className="text-sm font-semibold text-brand-400 tracking-wider uppercase mb-2">Estimated Footprint</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
            {totalWeekly}
          </span>
          <span className="text-xl font-medium text-slate-400">lbs CO₂e / week</span>
        </div>
        
        {/* Breakdown Bar */}
        <div 
          className="mt-6 flex h-3 rounded-full overflow-hidden bg-slate-800 w-full gap-0.5"
          role="img"
          aria-label={`Carbon emissions breakdown: Transport represents ${Math.round((transportWeekly / totalWeekly) * 100) || 0}%, Energy represents ${Math.round((energyWeekly / totalWeekly) * 100) || 0}%, and Diet represents ${Math.round((dietWeekly / totalWeekly) * 100) || 0}%`}
        >
          <div 
            style={{ width: `${(transportWeekly / totalWeekly) * 100 || 0}%` }} 
            className="bg-blue-500 hover:opacity-80 transition-opacity"
            title={`Transport: ${transportWeekly} lbs`}
          ></div>
          <div 
            style={{ width: `${(energyWeekly / totalWeekly) * 100 || 0}%` }} 
            className="bg-yellow-500 hover:opacity-80 transition-opacity"
            title={`Energy: ${energyWeekly} lbs`}
          ></div>
          <div 
            style={{ width: `${(dietWeekly / totalWeekly) * 100 || 0}%` }} 
            className="bg-emerald-500 hover:opacity-80 transition-opacity"
            title={`Diet: ${dietWeekly} lbs`}
          ></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Transport</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Energy</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Diet</span>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <span className="text-emerald-400">✨</span> Personalized Action Plan
        </h3>
        <ul className="space-y-4" role="list">
          {actionPlan.map((tip, index) => (
            <li 
              key={index} 
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="font-semibold text-slate-200 mb-1">{tip.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{tip.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
