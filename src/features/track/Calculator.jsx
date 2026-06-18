const InputField = ({ label, name, type, placeholder, unit, value, onChange, error }) => {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-slate-900 border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'} rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all pr-12`}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-400 mt-1 flex items-center gap-1 animate-fade-in" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default function Calculator({ inputs, updateInput, errors }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateInput(name, value);
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-brand-400">📊</span> Track Usage
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          Enter your estimated weekly or monthly metrics below. We use standard EPA factors to estimate your footprint.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="Carbon Footprint Calculator Form">
        
        <InputField 
          label="Driving Distance (Weekly)" 
          name="milesDriven" 
          type="text" 
          placeholder="e.g. 150" 
          unit="miles"
          value={inputs.milesDriven}
          onChange={handleChange}
          error={errors.milesDriven}
        />

        <InputField 
          label="Public Transit Distance (Weekly)" 
          name="publicTransit" 
          type="text" 
          placeholder="e.g. 50" 
          unit="miles"
          value={inputs.publicTransit}
          onChange={handleChange}
          error={errors.publicTransit}
        />

        <InputField 
          label="Electricity Bill (Monthly)" 
          name="energyUsage" 
          type="text" 
          placeholder="e.g. 80" 
          unit="$"
          value={inputs.energyUsage}
          onChange={handleChange}
          error={errors.energyUsage}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="diet-select" className="text-sm font-medium text-slate-300">
            Meat Consumption
          </label>
          <div className="relative">
            <select
              id="diet-select"
              name="meatConsumption"
              value={inputs.meatConsumption}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="high">High (Daily meat)</option>
              <option value="medium">Medium (Few times a week)</option>
              <option value="low">Low (Pescatarian / Once a week)</option>
              <option value="none">None (Vegetarian / Vegan)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
