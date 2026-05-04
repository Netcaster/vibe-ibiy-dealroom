import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps { className?: string; children?: React.ReactNode; style?: React.CSSProperties; }

export function Card({ className, children, style }: CardProps) {
  return <div className={cn('rounded-lg border', className)} style={style}>{children}</div>;
}

export function CardContent({ className, children, style }: CardProps) {
  return <div className={cn('p-6', className)} style={style}>{children}</div>;
}
