'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from 'sonner';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

import { Button } from '../button';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'link' | 'iconButton';
}

interface ToasterProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}

export interface ToasterRef {
  show: (props: ToasterProps) => void;
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-card border-border text-foreground',
  success: 'bg-card border-green-600/50',
  error: 'bg-card border-destructive/50',
  warning: 'bg-card border-amber-600/50',
};

const titleColor: Record<Variant, string> = {
  default: 'text-foreground',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
};

const iconColor: Record<Variant, string> = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const Toaster = forwardRef<ToasterRef, { defaultPosition?: Position }>(
  ({ defaultPosition = 'bottom-right' }, ref) => {
    const toastReference = useRef<ReturnType<typeof sonnerToast.custom> | null>(null);

    useImperativeHandle(ref, () => ({
      show({
        title,
        message,
        variant = 'default',
        duration = 4000,
        position = defaultPosition,
        actions,
        onDismiss,
        highlightTitle,
      }) {
        const Icon = variantIcons[variant];

        toastReference.current = sonnerToast.custom(
          (toastId) => (
            <motion.div
              variants={toastAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex items-center justify-between w-full max-w-xs p-3 rounded-xl border shadow-md',
                variantStyles[variant]
              )}
            >
              <div className="flex items-start gap-2">
                <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', iconColor[variant])} />
                <div className="space-y-0.5">
                  {title && (
                    <h3
                      className={cn(
                        'text-xs font-medium leading-none',
                        titleColor[variant],
                        highlightTitle && titleColor['success'] // override for meeting case
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  <p className="text-xs text-muted-foreground">{message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {actions?.label && (
                  <Button
                    variant={actions.variant || 'ghost'}
                    size="sm"
                    onClick={() => {
                      actions.onClick();
                      sonnerToast.dismiss(toastId);
                    }}
                    className={cn(
                      'cursor-pointer',
                      variant === 'success'
                        ? 'text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20'
                        : variant === 'error'
                        ? 'text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20'
                        : variant === 'warning'
                        ? 'text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20'
                        : 'text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20'
                    )}
                  >
                    {actions.label}
                  </Button>
                )}

                <button
                  onClick={() => {
                    sonnerToast.dismiss(toastId);
                    onDismiss?.();
                  }}
                  className="rounded-full p-1 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ),
          { duration, position }
        );
      },
    }));

    return (
      <SonnerToaster
        position={defaultPosition}
        toastOptions={{ unstyled: true, className: 'flex justify-end' }}
      />
    );
  }
);

// Compatibility layer for existing toast usage
const compatibleToast = (options: { 
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
  title?: string; 
  description?: string; 
  duration?: number;
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick: () => void };
}) => {
  const { variant = 'default', title, description, duration = 4000, action, cancel } = options;
  
  // Map old variants to new variants
  const variantMap: Record<string, 'default' | 'success' | 'error' | 'warning'> = {
    'default': 'default',
    'success': 'success', 
    'destructive': 'error',
    'warning': 'warning',
    'info': 'default'
  };
  
  const message = description || title || '';
  
  // If there are action/cancel buttons, use a custom toast
  if (action || cancel) {
    return sonnerToast.custom((toastId) => {
      const Icon = variantIcons[variantMap[variant] || 'default'];
      
      return (
        <motion.div
          variants={toastAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'flex items-center justify-between w-full max-w-xs p-3 rounded-xl border shadow-md',
            variantStyles[variantMap[variant] || 'default']
          )}
        >
          <div className="flex items-start gap-2">
            <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', iconColor[variantMap[variant] || 'default'])} />
            <div className="space-y-0.5">
              {title && (
                <h3 className={cn('text-xs font-medium leading-none', titleColor[variantMap[variant] || 'default'])}>
                  {title}
                </h3>
              )}
              <p className="text-xs text-muted-foreground">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cancel?.label && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancel.onClick();
                  sonnerToast.dismiss(toastId);
                }}
                className="cursor-pointer"
              >
                {cancel.label}
              </Button>
            )}
            {action?.label && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  action.onClick();
                  sonnerToast.dismiss(toastId);
                }}
                className={cn(
                  'cursor-pointer',
                  variantMap[variant] === 'error'
                    ? 'text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20'
                    : variantMap[variant] === 'success'
                    ? 'text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20'
                    : variantMap[variant] === 'warning'
                    ? 'text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20'
                    : 'text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20'
                )}
              >
                {action.label}
              </Button>
            )}
            <button
              onClick={() => sonnerToast.dismiss(toastId)}
              className="rounded-full p-1 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Dismiss notification"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      );
    }, { duration });
  }
  
  // Simple toast without actions
  return sonnerToast[variantMap[variant] || 'default'](message, {
    duration,
    ...(title && description && { description: title })
  });
};

// Add convenience methods
compatibleToast.success = (message: string, options?: any) => 
  sonnerToast.success(message, options);

compatibleToast.error = (message: string, options?: any) => 
  sonnerToast.error(message, options);

compatibleToast.warning = (message: string, options?: any) => 
  sonnerToast.warning(message, options);

compatibleToast.info = (message: string, options?: any) => 
  sonnerToast.info(message, options);

compatibleToast.dismiss = (id?: string) => 
  sonnerToast.dismiss(id);

// Export useToast hook for compatibility with existing codebase
export const useToast = () => ({ toast: compatibleToast });

// Export additional utilities for compatibility
export const toast = compatibleToast;

export default Toaster;
