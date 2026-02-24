import { render, screen } from '@testing-library/react';
import App from './App';

// Unit Test: Checks if the main heading renders
test('renders GitHub Explorer heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/GitHub Explorer/i);
  expect(linkElement).toBeInTheDocument();
});

// Snapshot Test: Ensures UI doesn't change unexpectedly
test('renders correctly (snapshot)', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});
