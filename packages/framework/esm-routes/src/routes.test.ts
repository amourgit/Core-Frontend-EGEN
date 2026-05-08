import createFetchMock from 'vitest-fetch-mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

createFetchMock(vi).enableMocks();

import { addRoutesOverride, isEigenAppRoutes } from './routes';

describe('Eigen Routes Utilities', () => {
  describe('addRoutesOverride', () => {
    beforeEach(() => localStorage.clear());

    it('should add routes when provided as an object', () => {
      addRoutesOverride('@egen/my-module', {
        backendDependencies: {
          fhir2: '^2.0.0',
          'webservices.rest': '^1.4.0',
        },
        version: '1.2.0-pre.12345+build.8',
        pages: [
          {
            component: 'root',
            route: 'myPage',
          },
        ],
        extensions: [
          {
            name: 'custom extension',
            component: 'customExtension',
          },
        ],
      });

      expect(localStorage.getItem('eigen-routes:@egen/my-module')).toBe(
        '{"backendDependencies":{"fhir2":"^2.0.0","webservices.rest":"^1.4.0"},"version":"1.2.0-pre.12345+build.8","pages":[{"component":"root","route":"myPage"}],"extensions":[{"name":"custom extension","component":"customExtension"}]}',
      );
    });

    it('should add routes when provided as a JSON string', () => {
      addRoutesOverride(
        '@egen/my-module',
        JSON.stringify({
          backendDependencies: {
            fhir2: '^2.0.0',
            'webservices.rest': '^1.4.0',
          },
          version: '1.2.0-pre.12345+build.8',
          pages: [
            {
              component: 'root',
              route: 'myPage',
            },
          ],
          extensions: [
            {
              name: 'custom extension',
              component: 'customExtension',
            },
          ],
        }),
      );

      expect(localStorage.getItem('eigen-routes:@egen/my-module')).toBe(
        '{"backendDependencies":{"fhir2":"^2.0.0","webservices.rest":"^1.4.0"},"version":"1.2.0-pre.12345+build.8","pages":[{"component":"root","route":"myPage"}],"extensions":[{"name":"custom extension","component":"customExtension"}]}',
      );
    });

    it('should add routes when loaded via a string HTTP endpoint', () => {
      addRoutesOverride('@egen/my-module', 'http://localhost/my-route-override.json');

      expect(localStorage.getItem('eigen-routes:@egen/my-module')).toBe(
        '"http://localhost/my-route-override.json"',
      );
    });

    it('should add routes when loaded via a URL HTTP endpoint', () => {
      addRoutesOverride('@egen/my-module', new URL('http://localhost/my-route-override.json'));

      expect(localStorage.getItem('eigen-routes:@egen/my-module')).toBe(
        '"http://localhost/my-route-override.json"',
      );
    });
  });

  describe('isEigenAppRoutes', () => {
    it('should return true for a valid routes object', () => {
      expect(
        isEigenAppRoutes({
          backendDependencies: {
            fhir2: '^2.0.0',
            'webservices.rest': '^1.4.0',
          },
          version: '1.2.0-pre.12345+build.8',
          pages: [
            {
              component: 'root',
              route: 'myPage',
            },
          ],
          extensions: [
            {
              name: 'custom extension',
              component: 'customExtension',
            },
          ],
          modals: [
            {
              name: 'custom modal',
              component: 'customModal',
            },
          ],
          workspaces: [
            {
              name: 'custom workspace',
              component: 'customWorkspace',
            },
          ],
        }),
      ).toBe(true);
    });

    it('should accept an object with only pages', () => {
      expect(
        isEigenAppRoutes({
          pages: [
            {
              component: 'root',
              route: 'myPage',
            },
          ],
        }),
      ).toBe(true);
    });

    it('should accept an object with only extensions', () => {
      expect(
        isEigenAppRoutes({
          extensions: [
            {
              name: 'custom extension',
              component: 'customExtension',
            },
          ],
        }),
      ).toBe(true);
    });

    it('should accept an object with only modals', () => {
      expect(
        isEigenAppRoutes({
          modals: [
            {
              name: 'custom modal',
              component: 'customModal',
            },
          ],
        }),
      ).toBe(true);
    });

    it('should accept an object with only workspaces', () => {
      expect(
        isEigenAppRoutes({
          workspaces: [
            {
              name: 'custom workspace',
              component: 'customWorkspace',
            },
          ],
        }),
      ).toBe(true);
    });

    it('should report an empty object as valid', () => {
      expect(isEigenAppRoutes({})).toBe(true);
    });
  });
});
