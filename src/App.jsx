import { useCarbonCalculator } from './hooks/useCarbonCalculator';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './features/understand/Dashboard';
import Calculator from './features/track/Calculator';
import ActionPlan from './features/reduce/ActionPlan';

function App() {
  const calculatorState = useCarbonCalculator();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        {/* Section 1: Understand */}
        <section id="understand" className="animate-fade-in">
          <Dashboard />
        </section>

        {/* Section 2 & 3: Track & Reduce */}
        <section id="track" className="animate-slide-up grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="order-2 lg:order-1">
            <Calculator {...calculatorState} />
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <ActionPlan results={calculatorState.results} actionPlan={calculatorState.actionPlan} />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default App;
