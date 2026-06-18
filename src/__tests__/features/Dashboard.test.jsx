import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from '../../features/understand/Dashboard';

describe('Dashboard Component', () => {
  it('renders header text and educational cards', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: /understand your impact/i })).toBeInTheDocument();
    expect(screen.getByText(/a carbon footprint is the total amount/i)).toBeInTheDocument();

    // Semantic articles should be focusable
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBe(3);
    
    // Check cards
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Energy Usage')).toBeInTheDocument();
    expect(screen.getByText('Diet & Food')).toBeInTheDocument();
  });
});
