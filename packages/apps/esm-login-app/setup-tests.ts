import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

declare global {
  interface Window {
    eigenBase: string;
    spaBase: string;
    getEigenSpaBase: () => string;
  }
}

const { getComputedStyle } = window;
window.getComputedStyle = (element) => getComputedStyle(element);
window.eigenBase = '/eigen';
window.spaBase = '/spa';
window.getEigenSpaBase = () => '/eigen/spa/';
window.HTMLElement.prototype.scrollIntoView = vi.fn();
