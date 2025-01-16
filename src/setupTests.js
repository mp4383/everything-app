import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Material-UI components that may cause issues in tests
vi.mock('@mui/material', () => ({
  Typography: ({ children, ...props }) => React.createElement('div', props, children),
  Card: ({ children, ...props }) => React.createElement('div', props, children),
  CardContent: ({ children, ...props }) => React.createElement('div', props, children),
  Link: ({ children, ...props }) => React.createElement('a', props, children),
  Stack: ({ children, ...props }) => React.createElement('div', props, children),
  Box: ({ children, ...props }) => React.createElement('div', props, children),
  CircularProgress: () => React.createElement('div', { role: 'progressbar' }, 'Loading...')
}));

// Mock API calls
vi.mock('./services/api', () => ({
  api: {
    get: vi.fn()
  }
}));
