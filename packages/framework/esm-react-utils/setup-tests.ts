import { afterEach, vi } from 'vitest';
import type {} from '@egen/esm-globals';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

global.window.eigenBase = '/eigen';
global.window.spaBase = '/spa';
global.window.getEigenSpaBase = () => '/eigen/spa/';

vi.mock('@egen/esm-navigation', async () => {
  const actual = await vi.importActual('@egen/esm-navigation');

  return {
    ...actual,
    navigate: vi.fn(),
  };
});

afterEach(cleanup);
