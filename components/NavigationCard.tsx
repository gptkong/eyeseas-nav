'use client';

import { NavigationLink } from '@/lib/types';
import { ExternalLink, Globe, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNetworkMode } from '@/lib/contexts/NetworkModeContext';

interface NavigationCardProps {
  link: NavigationLink;
  onClick?: () => void;
}

export function NavigationCard({ link, onClick }: NavigationCardProps) {
  const { networkMode } = useNetworkMode();

  const currentUrl = networkMode === 'internal' ? link.internalUrl : link.externalUrl;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getNetworkIcon = () => {
    return networkMode === 'internal' ? (
      <Building className="w-4 h-4 text-blue-600" />
    ) : (
      <Globe className="w-4 h-4 text-green-600" />
    );
  };

  const getNetworkBadge = () => {
    return networkMode === 'internal' ? (
      <Badge variant="default" className="text-xs">Internal</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">External</Badge>
    );
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] sm:hover:scale-[1.02]",
        !link.isActive && "opacity-60"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {link.favicon ? (
              <img
                src={link.favicon}
                alt=""
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              getNetworkIcon()
            )}
            <h3 className="text-sm sm:text-base font-semibold truncate">
              {link.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="hidden xs:block">
              {getNetworkBadge()}
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
          {link.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate flex-1 mr-2">
            {new URL(currentUrl).hostname}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="xs:hidden">
              {getNetworkBadge()}
            </div>
            {!link.isActive && (
              <Badge variant="outline" className="text-xs">Inactive</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
