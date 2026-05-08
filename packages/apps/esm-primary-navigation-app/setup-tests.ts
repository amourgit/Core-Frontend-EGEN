import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

window.eigenBase = '/eigen';
window.spaBase = '/spa';
window.getEigenSpaBase = vi.fn(() => '/eigen/spa/');

afterEach(cleanup);
