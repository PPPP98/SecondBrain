import * as React from 'react';
import { cn } from '@/lib/utils/utils';

/**
 * Simple CSS-only Tooltip for Shadow DOM
 * - Radix UI Tooltip의 positioning이 Shadow DOM에서 작동하지 않아 대체
 */

interface SimpleTooltipProps {
  children: React.ReactElement;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'left-bottom';
}

export function SimpleTooltip({ children, content, side = 'bottom' }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => {
        console.log('🔍 [SimpleTooltip] Mouse enter, showing:', content);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        console.log('🔍 [SimpleTooltip] Mouse leave');
        setIsVisible(false);
      }}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-[99999] px-3 py-1.5 text-xs rounded-md bg-foreground text-background whitespace-nowrap pointer-events-none shadow-lg',
            side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
            side === 'bottom' && 'top-full left-0 mt-2',
            side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
            side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
            side === 'left-bottom' && 'right-full -bottom-10 mr-2',
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
