import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainLayout from '../../components/layout/MainLayout';

describe('MainLayout Component', () => {
  it('renders header, navigation links, main children, and footer', () => {
    render(
      <MainLayout>
        <div data-testid="child-element">Test Children</div>
      </MainLayout>
    );

    // Header branding
    expect(screen.getByRole('heading', { name: /ecotrack/i })).toBeInTheDocument();

    // Navigation links
    expect(screen.getByRole('link', { name: /understand/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /track & reduce/i })).toBeInTheDocument();

    // Main content
    expect(screen.getByTestId('child-element')).toBeInTheDocument();

    // Footer copyright
    expect(screen.getByText(/ecotrack hackathon project/i)).toBeInTheDocument();
  });
});
