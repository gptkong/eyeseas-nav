'use client';

import { NavigationLink } from '@/lib/types';
import { ExternalLink, Globe, Building } from 'lucide-react';

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
      <div className="badge badge-primary badge-sm">Internal</div>
    ) : (
      <div className="badge badge-secondary badge-sm">External</div>
    );
  };

  return (
    <div 
      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-base-200"
      onClick={handleClick}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {link.favicon ? (
              <img 
                src={link.favicon} 
                alt="" 
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              getCategoryIcon()
            )}
            <h3 className="card-title text-sm font-semibold truncate">
              {link.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {getCategoryBadge()}
            <ExternalLink className="w-3 h-3 text-base-content/60" />
          </div>
        </div>
        
        <p className="text-xs text-base-content/70 line-clamp-2 mb-3">
          {link.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/50 truncate">
            {new URL(link.url).hostname}
          </span>
          {!link.isActive && (
            <div className="badge badge-ghost badge-xs">Inactive</div>
          )}
        </div>
      </div>
    </div>
  );
}
