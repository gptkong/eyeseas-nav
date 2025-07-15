'use client';

import { useNetworkMode } from '@/lib/contexts/NetworkModeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Building, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkModeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function NetworkModeToggle({ 
  className, 
  showLabel = true, 
  size = 'md' 
}: NetworkModeToggleProps) {
  const { networkMode, toggleNetworkMode } = useNetworkMode();

  const isInternal = networkMode === 'internal';
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <Badge
          variant={isInternal ? 'default' : 'secondary'}
          className="text-xs hidden sm:inline-flex"
        >
          {isInternal ? 'Internal' : 'External'}
        </Badge>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={toggleNetworkMode}
        className={cn(
          'flex items-center gap-1 sm:gap-2 transition-all duration-200 min-w-0',
          sizeClasses[size],
          isInternal
            ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
        )}
        title={`Switch to ${isInternal ? 'External' : 'Internal'} Network`}
      >
        {isInternal ? (
          <Building className={iconSizes[size]} />
        ) : (
          <Globe className={iconSizes[size]} />
        )}

        {showLabel && (
          <>
            <span className="hidden md:inline text-xs sm:text-sm">
              {isInternal ? 'Internal' : 'External'}
            </span>
            <span className="hidden sm:inline md:hidden text-xs">
              {isInternal ? 'Int' : 'Ext'}
            </span>
            {isInternal ? (
              <ToggleLeft className={cn(iconSizes[size], 'hidden sm:inline')} />
            ) : (
              <ToggleRight className={cn(iconSizes[size], 'hidden sm:inline')} />
            )}
          </>
        )}
      </Button>
    </div>
  );
}
