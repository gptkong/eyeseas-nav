'use client';

import { NavigationLink } from '@/lib/types';
import { ExternalLink, Globe, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavigationCardProps {
  link: NavigationLink;
  onClick?: () => void;
}

export function NavigationCard({ link, onClick }: NavigationCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryIcon = () => {
    return link.category === 'internal' ? (
      <Building className="w-4 h-4" />
    ) : (
      <Globe className="w-4 h-4" />
    );
  };

  const getCategoryBadge = () => {
    return link.category === 'internal' ? (
      <Badge variant="default" className="text-xs">Internal</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">External</Badge>
    );
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        !link.isActive && "opacity-60"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
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
              getCategoryIcon()
            )}
            <h3 className="text-sm font-semibold truncate">
              {link.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getCategoryBadge()}
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {link.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">
            {new URL(link.url).hostname}
          </span>
          {!link.isActive && (
            <Badge variant="outline" className="text-xs">Inactive</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
