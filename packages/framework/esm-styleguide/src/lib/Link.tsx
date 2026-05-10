// Compatibility shim: Next.js Link API -> React Router Link
// Converts href -> to, ignores prefetch prop
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  to?: string;
  prefetch?: boolean | 'intent' | 'render' | 'none' | 'viewport';
  className?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, to, prefetch: _prefetch, ...rest }) => {
  const destination = to ?? href ?? '/';
  return <RouterLink to={destination} {...rest} />;
};

export type { LinkProps };
export default Link;
