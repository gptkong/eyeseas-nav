'use client';

import { NavigationLink } from '@/lib/types';
import { ExternalLink, Globe, Building, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNetworkMode } from '@/lib/contexts/NetworkModeContext';
import Image from 'next/image';

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
      <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
    );
  };

  const getNetworkBadge = () => {
    return networkMode === 'internal' ? (
      <Badge
        variant="default"
        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      >
        Internal
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      >
        External
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20",
        "hover:border-primary/20 dark:hover:border-primary/30",
        "active:scale-[0.98] sm:hover:scale-[1.02]",
        "transform-gpu will-change-transform",
        "bg-gradient-to-br from-card to-card/80",
        "border-border/50 hover:border-border",
        !link.isActive && "opacity-60 hover:opacity-80"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {link.favicon ? (
                <div className="relative w-5 h-5">
                  <Image
                    src={link.favicon}
                    alt=""
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-sm ring-1 ring-border/20 group-hover:ring-primary/30 transition-all duration-200 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 rounded-sm pointer-events-none" />
                </div>
              ) : (
                <div className="p-1 rounded-md bg-muted/50 group-hover:bg-muted transition-colors duration-200">
                  {getNetworkIcon()}
                </div>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors duration-200">
              {link.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden xs:block">
              {getNetworkBadge()}
            </div>
            <div className="p-1 rounded-full bg-muted/30 group-hover:bg-muted/60 transition-colors duration-200">
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {link.description}
          </p>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-1 border-t border-border/30">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-muted-foreground/80 truncate font-mono">
              {new URL(currentUrl).hostname}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="xs:hidden">
              {getNetworkBadge()}
            </div>
            {!link.isActive && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
