import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ActionPlan from '../../features/reduce/ActionPlan';

describe('ActionPlan Component', () => {
  const mockResults = {
    transportWeekly: 100,
    energyWeekly: 50,
    dietWeekly: 50,
    totalWeekly: 200,
  };

  const mockActionPlan = [
    {
      category: 'Transportation',
      title: 'Carpool or Telecommute',
      description: 'Your transportation emissions are high. Consider working from home.'
    },
    {
      category: 'Diet',
      title: 'Meatless Mondays',
      description: 'Try substituting meat with plant-based alternatives.'
    }
  ];

  it('renders "Awaiting Data" message when results are null', () => {
    render(<ActionPlan results={null} actionPlan={[]} />);

    expect(screen.getByText(/awaiting data/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your metrics in the tracker/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /sprout/i })).toBeInTheDocument();
  });

  it('renders total weekly emissions and categories breakdown when results are provided', () => {
    render(<ActionPlan results={mockResults} actionPlan={mockActionPlan} />);

    // Total weekly emission score
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText(/lbs co₂e \/ week/i)).toBeInTheDocument();

    // Check legend items
    expect(screen.getByText(/^Transport$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Energy$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Diet$/i)).toBeInTheDocument();
  });

  it('renders breakdown bar with correct accessibility attributes', () => {
    render(<ActionPlan results={mockResults} actionPlan={mockActionPlan} />);

    const breakdownBar = screen.getByRole('img', {
      name: /carbon emissions breakdown: transport represents 50%, energy represents 25%, and diet represents 25%/i
    });
    expect(breakdownBar).toBeInTheDocument();
  });

  it('renders actionable tips list', () => {
    render(<ActionPlan results={mockResults} actionPlan={mockActionPlan} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Carpool or Telecommute')).toBeInTheDocument();
    expect(screen.getByText('Meatless Mondays')).toBeInTheDocument();
    expect(screen.getByText('Your transportation emissions are high. Consider working from home.')).toBeInTheDocument();
  });
});
