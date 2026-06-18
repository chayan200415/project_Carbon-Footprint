import { useState, useMemo, useCallback } from 'react';

// Standard estimates for carbon footprint calculations
// Transportation: ~0.89 lbs CO2 per mile driven (average car)
// Public Transit: ~0.39 lbs CO2 per mile (average bus/train)
// Energy Usage: ~0.85 lbs CO2 per kWh (average US grid)
// Average US electricity cost: ~$0.16 per kWh
// Diet: 
//   - High meat (daily): ~7.2 lbs CO2e/day
//   - Medium meat (few times a week): ~5.6 lbs CO2e/day
//   - Low meat (once a week/pescatarian): ~3.8 lbs CO2e/day
//   - Vegetarian/Vegan: ~2.9 lbs CO2e/day

const EMISSION_FACTORS = {
  drivingPerMile: 0.89,
  transitPerMile: 0.39,
  energyPerKwh: 0.85,
  costPerKwh: 0.16,
  dietDailyMap: {
    high: 7.2,
    medium: 5.6,
    low: 3.8,
    none: 2.9,
  }
};

export function useCarbonCalculator() {
  const [inputs, setInputs] = useState({
    milesDriven: '',
    publicTransit: '',
    energyUsage: '', // Monthly Electricity Bill in $
    meatConsumption: 'medium', // high, medium, low, none
  });

  const updateInput = useCallback((name, value) => {
    // Sanitize input: limit text length to avoid memory/rendering overhead
    const sanitizedValue = String(value).slice(0, 10);

    setInputs(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  }, []);

  // Declarative error validation derived from state
  const errors = useMemo(() => {
    const derivedErrors = {};
    
    ['milesDriven', 'publicTransit', 'energyUsage'].forEach(field => {
      const val = inputs[field];
      if (val !== '') {
        const num = Number(val);
        // Ensure the value is a valid positive finite number
        if (isNaN(num) || num < 0 || !isFinite(num)) {
          derivedErrors[field] = 'Please enter a valid positive number';
        }
      }
    });

    return derivedErrors;
  }, [inputs]);

  // Calculate footprint
  const results = useMemo(() => {
    // Return null if there are validation errors
    if (Object.keys(errors).length > 0) return null;

    // Sanitize to 0 if empty
    const milesDriven = Number(inputs.milesDriven) || 0;
    const publicTransit = Number(inputs.publicTransit) || 0;
    const energyBill = Number(inputs.energyUsage) || 0;
    
    const dietDailyEmission = EMISSION_FACTORS.dietDailyMap[inputs.meatConsumption] || EMISSION_FACTORS.dietDailyMap.medium;

    // Calculate weekly estimates
    const transportWeekly = (milesDriven * EMISSION_FACTORS.drivingPerMile) + (publicTransit * EMISSION_FACTORS.transitPerMile);
    
    // Convert monthly electricity bill ($) to weekly kWh estimate (approx 4.33 weeks per month)
    const energyWeeklyKwh = (energyBill / EMISSION_FACTORS.costPerKwh) / 4.33;
    const energyWeekly = energyWeeklyKwh * EMISSION_FACTORS.energyPerKwh;
    
    const dietWeekly = dietDailyEmission * 7;

    const totalWeekly = transportWeekly + energyWeekly + dietWeekly;

    return {
      transportWeekly: Number(transportWeekly.toFixed(2)),
      energyWeekly: Number(energyWeekly.toFixed(2)),
      dietWeekly: Number(dietWeekly.toFixed(2)),
      totalWeekly: Number(totalWeekly.toFixed(2))
    };
  }, [inputs, errors]);

  // Generate actionable tips dynamically based on calculated footprint
  const actionPlan = useMemo(() => {
    if (!results) return [];

    const tips = [];
    const { transportWeekly, energyWeekly } = results;
    const publicTransitDistance = Number(inputs.publicTransit) || 0;

    // 1. Transportation Tips
    if (transportWeekly > 50) {
      tips.push({
        category: 'Transportation',
        title: 'Carpool or Telecommute',
        description: 'Your transportation emissions are high. Consider working from home 1-2 days a week or organizing a carpool to significantly reduce your driving footprint.'
      });
    }
    if (publicTransitDistance > 30) {
      tips.push({
        category: 'Transportation',
        title: 'Choose Active Transit',
        description: 'Your public transit usage is great! For shorter trips under 2 miles, consider walking or biking to further reduce your emissions and stay healthy.'
      });
    }

    // 2. Energy Tips
    if (energyWeekly > 100) {
      tips.push({
        category: 'Energy',
        title: 'Optimize Home Heating and Cooling',
        description: 'Your electricity footprint indicates higher than average usage. Try adjusting your thermostat by 2 degrees and switching to LED bulbs.'
      });
    } else if (energyWeekly > 50) {
      tips.push({
        category: 'Energy',
        title: 'Unplug Idle Electronics',
        description: 'charger bricks and appliances still draw power when plugged in but not active. Unplugging them can save up to 10% on your monthly electric bill.'
      });
    }

    // 3. Diet Tips
    if (inputs.meatConsumption === 'high') {
      tips.push({
        category: 'Diet',
        title: 'Meatless Mondays',
        description: 'Replacing meat with plant-based alternatives just one day a week can lower your diet footprint substantially.'
      });
    } else if (inputs.meatConsumption === 'medium') {
      tips.push({
        category: 'Diet',
        title: 'Introduce Plant-Based Days',
        description: 'You consume meat a few times a week. Adding another vegetarian or vegan day each week will significantly reduce your dietary carbon footprint.'
      });
    }

    // Generic tip if everything is low
    if (tips.length === 0) {
      tips.push({
        category: 'General',
        title: 'Great Job! Keep it up.',
        description: 'Your carbon footprint is well below average. Share your tips with friends and consider planting trees or supporting local sustainability initiatives.'
      });
    }

    return tips;
  }, [results, inputs.meatConsumption, inputs.publicTransit]);

  return {
    inputs,
    updateInput,
    errors,
    results,
    actionPlan
  };
}
