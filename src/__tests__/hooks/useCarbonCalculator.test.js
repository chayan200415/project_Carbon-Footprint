import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCarbonCalculator } from '../../hooks/useCarbonCalculator';

describe('useCarbonCalculator hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCarbonCalculator());
    
    expect(result.current.inputs).toEqual({
      milesDriven: '',
      publicTransit: '',
      energyUsage: '',
      meatConsumption: 'medium',
    });
    expect(result.current.errors).toEqual({});
  });

  it('should update inputs and clear existing errors', () => {
    const { result } = renderHook(() => useCarbonCalculator());

    // Setup an initial error
    act(() => {
      result.current.updateInput('milesDriven', '-10');
    });

    // Force validation to set the error
    // In our implementation, validation happens during result calculation
    expect(result.current.results).toBeNull();
    expect(result.current.errors.milesDriven).toBeDefined();

    // Now update input correctly
    act(() => {
      result.current.updateInput('milesDriven', '50');
    });

    expect(result.current.inputs.milesDriven).toBe('50');
    expect(result.current.errors.milesDriven).toBeUndefined();
  });

  it('should calculate valid footprints correctly', () => {
    const { result } = renderHook(() => useCarbonCalculator());

    act(() => {
      result.current.updateInput('milesDriven', '100'); // 100 * 0.89 = 89
      result.current.updateInput('publicTransit', '50'); // 50 * 0.39 = 19.5
      result.current.updateInput('energyUsage', '48'); // ($48 bill / 0.16) = 300 kWh. (300 / 4.33) * 0.85 = ~58.89
      result.current.updateInput('meatConsumption', 'high'); // 7.2 * 7 = 50.4
    });

    expect(result.current.results).toEqual({
      transportWeekly: 108.5, // 89 + 19.5
      energyWeekly: 58.89,
      dietWeekly: 50.4,
      totalWeekly: 217.79 // 108.5 + 58.89 + 50.4 = 217.79
    });
  });

  it('should validate invalid numeric inputs and return null result', () => {
    const { result } = renderHook(() => useCarbonCalculator());

    act(() => {
      result.current.updateInput('milesDriven', 'abc');
      result.current.updateInput('energyUsage', '-50');
    });

    expect(result.current.results).toBeNull();
    expect(result.current.errors.milesDriven).toBe('Please enter a valid positive number');
    expect(result.current.errors.energyUsage).toBe('Please enter a valid positive number');
  });

  it('should generate appropriate action plans based on high emissions', () => {
    const { result } = renderHook(() => useCarbonCalculator());

    act(() => {
      result.current.updateInput('milesDriven', '100'); // > 50 transport
      result.current.updateInput('energyUsage', '600'); // > 100 energy
      result.current.updateInput('meatConsumption', 'high');
    });

    expect(result.current.actionPlan.length).toBe(3);
    expect(result.current.actionPlan[0].category).toBe('Transportation');
    expect(result.current.actionPlan[1].category).toBe('Energy');
    expect(result.current.actionPlan[2].category).toBe('Diet');
  });

  it('should give generic positive feedback if emissions are low', () => {
    const { result } = renderHook(() => useCarbonCalculator());

    act(() => {
      result.current.updateInput('milesDriven', '10'); // low
      result.current.updateInput('energyUsage', '16'); // ($16 bill / 0.16) = 100 kWh (low)
      result.current.updateInput('meatConsumption', 'low'); // low
    });

    expect(result.current.actionPlan.length).toBe(1);
    expect(result.current.actionPlan[0].category).toBe('General');
  });
});
