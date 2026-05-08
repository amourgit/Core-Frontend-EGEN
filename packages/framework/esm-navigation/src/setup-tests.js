/* eslint-env node */
import { vi } from 'vitest';

global.window.eigenBase = '/eigen';
global.window.spaBase = '/spa';
global.window.getEigenSpaBase = () => '/eigen/spa/';
