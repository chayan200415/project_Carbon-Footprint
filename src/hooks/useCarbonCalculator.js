import { useState, useMemo, useCallback } from 'react';

// Standard estimates for carbon footprint calculations
// Transportation: ~0.89 lbs CO2 per mile driven (average car)
// Public Transit: ~0.39 lbs CO2 per mile (average bus/train)
// Energy Usage: ~0.85 lbs CO2 per kWh (average US grid)
// Diet: 
//   - High meat (daily): ~7.2 lbs CO2e/day
//   - Medium meat (few times a week): ~5.6 lbs CO2e/day
//   - Low meat (once a week/pescatarian): ~3.8 lbs CO2e/day
//   - Vegetarian/Vegan: ~2.9 lbs CO2e/day

const EMISSION_FACTORS = {
  drivingPerMile: 0.89,
  transitPerMile: 0.39,
  energyPerKwh: 0.85,
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
    energyUsage: '', // kWh per month
    meatConsumption: 'medium', // high, medium, low, none
  });

  const [errors, setErrors] = useState({});

  const updateInput = useCallback((name, value) => {
    // Sanitize input: limit text length to avoid memory/rendering overhead
    const sanitizedValue = String(value).slice(0, 10);

    setInputs(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error dynamically to avoid callback recreation
    setErrors(prev => {
      if (prev[name]) {
        return { ...prev, [name]: null };
      }
      return prev;
    });
  }, []);

  // Strict Validation Logic
  const validateInputs = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validate numeric inputs
    ['milesDriven', 'publicTransit', 'energyUsage'].forEach(field => {
      const val = inputs[field];
      if (val !== '') {
        const num = Number(val);
        // Ensure the value is a valid positive finite number
        if (isNaN(num) || num < 0 || !isFinite(num)) {
          newErrors[field] = 'Please enter a valid positive number';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [inputs]);

  // Calculate footprint
  const results = useMemo(() => {
    if (!validateInputs()) return null;

    // Sanitize to 0 if empty
    const milesDriven = Number(inputs.milesDriven) || 0;
    const publicTransit = Number(inputs.publicTransit) || 0;
    const energyUsage = Number(inputs.energyUsage) || 0;
    const dietDailyEmission = EMISSION_FACTORS.dietDailyMap[inputs.meatConsumption] || EMISSION_FACTORS.dietDailyMap.medium;

    // Calculate weekly estimates
    const transportWeekly = (milesDriven * EMISSION_FACTORS.drivingPerMile) + (publicTransit * EMISSION_FACTORS.transitPerMile);
    // Convert monthly kWh to weekly estimate (approx 4.33 weeks per month)
    const energyWeekly = (energyUsage / 4.33) * EMISSION_FACTORS.energyPerKwh;
    const dietWeekly = dietDailyEmission * 7;

    const totalWeekly = transportWeekly + energyWeekly + dietWeekly;

    return {
      transportWeekly: Number(transportWeekly.toFixed(2)),
      energyWeekly: Number(energyWeekly.toFixed(2)),
      dietWeekly: Number(dietWeekly.toFixed(2)),
      totalWeekly: Number(totalWeekly.toFixed(2))
    };
  }, [inputs, validateInputs]);

  // Generate actionable tips dynamically based on calculated footprint
  const actionPlan = useMemo(() => {
    if (!results) return [];

    const tips = [];
    const { transportWeekly, energyWeekly, dietWeekly } = results;

    if (transportWeekly > 50) {
      tips.push({
        category: 'Transportation',
        title: 'Carpool or Telecommute',
        description: 'Your transportation emissions are high. Consider working from home 1-2 days a week or organizing a carpool to significantly reduce your driving footprint.'
      });
    }

    if (energyWeekly > 100) {
      tips.push({
        category: 'Energy',
        title: 'Optimize Home Heating and Cooling',
        description: 'Your electricity footprint indicates higher than average usage. Try adjusting your thermostat by 2 degrees and switching to LED bulbs.'
      });
    }

    if (inputs.meatConsumption === 'high') {
      tips.push({
        category: 'Diet',
        title: 'Meatless Mondays',
        description: 'Replacing meat with plant-based alternatives just one day a week can lower your diet footprint substantially.'
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
  }, [results, inputs.meatConsumption]);

  return {
    inputs,
    updateInput,
    errors,
    results,
    actionPlan
  };
}
