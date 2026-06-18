import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Calculator from '../../features/track/Calculator';

describe('Calculator Component', () => {
  const mockInputs = {
    milesDriven: '100',
    publicTransit: '20',
    energyUsage: '300',
    meatConsumption: 'medium',
  };

  const mockUpdateInput = vi.fn();
  const mockErrors = {};

  beforeEach(() => {
    mockUpdateInput.mockClear();
  });

  it('renders all input fields with correct labels, placeholders, and values', () => {
    render(
      <Calculator 
        inputs={mockInputs} 
        updateInput={mockUpdateInput} 
        errors={mockErrors} 
      />
    );

    // Check Driving Distance input
    const drivingInput = screen.getByLabelText(/driving distance/i);
    expect(drivingInput).toBeInTheDocument();
    expect(drivingInput.value).toBe('100');

    // Check Transit input
    const transitInput = screen.getByLabelText(/public transit distance/i);
    expect(transitInput).toBeInTheDocument();
    expect(transitInput.value).toBe('20');

    // Check Energy input
    const energyInput = screen.getByLabelText(/home energy usage/i);
    expect(energyInput).toBeInTheDocument();
    expect(energyInput.value).toBe('300');

    // Check Dropdown select
    const select = screen.getByLabelText(/meat/i);
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('medium');
  });

  it('calls updateInput callback when text inputs change', () => {
    render(
      <Calculator 
        inputs={mockInputs} 
        updateInput={mockUpdateInput} 
        errors={mockErrors} 
      />
    );

    const drivingInput = screen.getByLabelText(/driving distance/i);
    fireEvent.change(drivingInput, { target: { value: '250' } });

    expect(mockUpdateInput).toHaveBeenCalledWith('milesDriven', '250');
  });

  it('calls updateInput callback when meat consumption dropdown selection changes', () => {
    render(
      <Calculator 
        inputs={mockInputs} 
        updateInput={mockUpdateInput} 
        errors={mockErrors} 
      />
    );

    const select = screen.getByLabelText(/meat/i);
    fireEvent.change(select, { target: { value: 'high' } });

    expect(mockUpdateInput).toHaveBeenCalledWith('meatConsumption', 'high');
  });

  it('displays validation errors and sets aria-invalid attributes correctly', () => {
    const errorsWithVal = {
      milesDriven: 'Please enter a valid positive number',
    };

    render(
      <Calculator 
        inputs={mockInputs} 
        updateInput={mockUpdateInput} 
        errors={errorsWithVal} 
      />
    );

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert.textContent).toContain('Please enter a valid positive number');

    const drivingInput = screen.getByLabelText(/driving distance/i);
    expect(drivingInput).toHaveAttribute('aria-invalid', 'true');

    const transitInput = screen.getByLabelText(/public transit distance/i);
    expect(transitInput).toHaveAttribute('aria-invalid', 'false');
  });
});
