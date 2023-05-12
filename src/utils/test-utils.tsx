import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import QueryClientProvider from '../QueryClientProvider';
import ThemeProvider from '../ThemeProvider';
import { BrowserRouter as Router } from 'react-router-dom';

const AllTheProviders = ({ children }: {children: React.ReactNode}) => {
  return (
    <QueryClientProvider>
      <Router>
        <ThemeProvider>{children}</ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
