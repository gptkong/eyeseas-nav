"use client";

import { NavigationLink } from "@/lib/types";
import { ExternalLink, Globe, Building, AlertCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNetworkMode } from "@/lib/contexts/NetworkModeContext";
import Image from "next/image";
import { useState } from "react";

interface NavigationCardProps {
  link: NavigationLink;
  onClick?: () => void;
  index?: number;
}

export function NavigationCard({ link, onClick, index = 0 }: NavigationCardProps) {
  const { networkMode } = useNetworkMode();
  const [isHovered, setIsHovered] = useState(false);

  const currentUrl =
    networkMode === "internal" ? link.internalUrl : link.externalUrl;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    }
  };

  const getNetworkIcon = () => {
    return networkMode === "internal" ? (
      <Building className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    ) : (
      <Globe className="w-5 h-5 text-green-500 dark:text-green-400" />
    );
  };

  const getNetworkColor = () => {
    return networkMode === "internal"
      ? "from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20"
      : "from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer rounded-2xl overflow-hidden",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-lg hover:shadow-2xl",
        "transition-all duration-500 ease-out",
        "transform-gpu will-change-transform",
        !link.isActive && "opacity-60 hover:opacity-90"
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          getNetworkColor()
        )}
      />

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative p-5 sm:p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Icon/Favicon */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {link.favicon ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md ring-2 ring-white/50 dark:ring-gray-700/50">
                  <Image
                    src={link.favicon}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-md">
                  {getNetworkIcon()}
                </div>
              )}
            </motion.div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate mb-0.5">
                {link.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {networkMode === "internal" ? "内网" : "外网"}
                </span>
              </div>
            </div>
          </div>

          {/* Arrow Icon */}
          <motion.div
            className="flex-shrink-0"
            animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500 transition-colors duration-300">
              <ArrowUpRight className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {link.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
              {new URL(currentUrl).hostname}
            </span>
          </div>

          {!link.isActive && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                未激活
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
