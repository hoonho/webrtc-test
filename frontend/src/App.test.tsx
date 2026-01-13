import { render, screen } from '@testing-library/react';
import App from './App';

test('renders syncroom brand', () => {
  render(<App />);
  const title = screen.getByText(/syncroom/i);
  expect(title).toBeInTheDocument();
});
