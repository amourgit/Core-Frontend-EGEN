/**
 * Checks if an installed version satisfies a required version range using
 * semver comparison. Handles prerelease versions and normalizes version strings.
 *
 * @param requiredVersion A semver range string (e.g., "^1.0.0", ">=2.0.0").
 * @param installedVersion The installed version string to check against the range.
 * @returns `true` if the installed version satisfies the required version range.
 *
 */
export declare function isVersionSatisfied(requiredVersion: string, installedVersion: string): boolean;
//# sourceMappingURL=version.d.ts.map