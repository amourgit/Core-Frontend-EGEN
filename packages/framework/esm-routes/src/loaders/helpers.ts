export function routeRegex(regex: RegExp, location: Location) {
  const result = regex.test(location.pathname.replace(window.getEigenSpaBase(), ''));
  return result;
}
