'use client';

import * as React from 'react';
import { Button, type buttonVariants } from './button';
import type { VariantProps } from 'class-variance-authority';
import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  disabled,
  children,
  className,
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn('w-full', className)}
      {...props}
    >
      {loading && (
        <LoaderCircleIcon
          className="animate-spin size-4 mr-2"
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  );
}
