import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Integration Test', () => {
  it('renders Layout, Dashboard, Calculator and ActionPlan', () => {
    render(<App />);

    // Layout header title
    expect(screen.getByRole('heading', { name: /ecotrack/i })).toBeInTheDocument();

    // Understand section title
    expect(screen.getByRole('heading', { name: /understand your impact/i })).toBeInTheDocument();

    // Calculator title
    expect(screen.getByRole('heading', { name: /track usage/i })).toBeInTheDocument();

    // Awaiting Data message in Action Plan (default state)
    expect(screen.getByText(/awaiting data/i)).toBeInTheDocument();
  });

  it('updates total weekly emissions and personalized tips dynamically when user inputs data', () => {
    render(<App />);

    const drivingInput = screen.getByLabelText(/driving distance/i);
    const transitInput = screen.getByLabelText(/public transit distance/i);
    const energyInput = screen.getByLabelText(/electricity bill/i);
    const select = screen.getByLabelText(/meat/i);

    // Enter transport data
    fireEvent.change(drivingInput, { target: { value: '100' } });
    fireEvent.change(transitInput, { target: { value: '50' } });
    // Enter energy data
    fireEvent.change(energyInput, { target: { value: '48' } }); // $48 bill -> 300 kWh -> 58.89 lbs
    // Change meat consumption to high
    fireEvent.change(select, { target: { value: 'high' } });

    // Expect the total score to update and show up: 108.5 + 58.89 + 50.4 = 217.79
    expect(screen.getByText('217.79')).toBeInTheDocument();

    // Expect the tips to be generated
    expect(screen.getByText('Carpool or Telecommute')).toBeInTheDocument();
    expect(screen.getByText('Meatless Mondays')).toBeInTheDocument();
    expect(screen.queryByText(/awaiting data/i)).not.toBeInTheDocument();
  });
});
