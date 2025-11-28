"use client";

import { NavigationLink } from "@/lib/types";
import { ExternalLink, Globe, Building, AlertCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNetworkMode } from "@/lib/contexts/NetworkModeContext";
import Image from "next/image";
import { useState, useCallback, useMemo, memo } from "react";

interface NavigationCardProps {
  link: NavigationLink;
  onClick?: () => void;
  index?: number;
}

const NavigationCardComponent = ({ link, onClick, index = 0 }: NavigationCardProps) => {
  const { networkMode } = useNetworkMode();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 缓存当前 URL
  const currentUrl = useMemo(
    () => networkMode === "internal" ? link.internalUrl : link.externalUrl,
    [networkMode, link.internalUrl, link.externalUrl]
  );

  // 缓存主机名
  const hostname = useMemo(() => {
    try {
      return new URL(currentUrl).hostname;
    } catch {
      return currentUrl;
    }
  }, [currentUrl]);

  // 点击处理
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    }
  }, [onClick, currentUrl]);

  // 网络图标
  const networkIcon = useMemo(() => {
    return networkMode === "internal" ? (
      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
    );
  }, [networkMode]);

  // 网络颜色
  const networkColor = useMemo(() => {
    return networkMode === "internal"
      ? "from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20"
      : "from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20";
  }, [networkMode]);

  // 动画延迟 - 限制前12个卡片
  const animationDelay = index < 12 ? index * 0.05 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70",
        "backdrop-blur-xl",
        "border border-gray-200/60 dark:border-gray-700/60",
        "shadow-lg hover:shadow-2xl",
        "transition-shadow duration-300",
        "transform-gpu",
        !link.isActive && "opacity-70 hover:opacity-95"
      )}
    >
      {/* 悬浮背景渐变 */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          networkColor
        )}
      />

      {/* 扫光效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
          initial={{ x: "-100%", skewX: -20 }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* 内容 */}
      <div className="relative p-3 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 z-10">
        {/* 头部 */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* 图标/Favicon */}
            <div className="relative flex-shrink-0">
              {link.favicon && !imageError ? (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/70 dark:ring-gray-600/70 bg-white/50 dark:bg-gray-700/50">
                  <Image
                    src={link.favicon}
                    alt=""
                    width={56}
                    height={56}
                    className="object-contain p-2"
                    loading={index < 8 ? "eager" : "lazy"}
                    priority={index < 4}
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg ring-2 ring-white/70 dark:ring-gray-600/70">
                  {networkIcon}
                </div>
              )}
            </div>

            {/* 标题和标签 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                {link.title}
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap",
                    networkMode === "internal"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  )}
                >
                  <span className="flex-shrink-0">{networkIcon}</span>
                  <span className="hidden sm:inline">{networkMode === "internal" ? "内网" : "外网"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 箭头图标 */}
          <motion.div
            className="flex-shrink-0"
            animate={{
              x: isHovered ? 4 : 0,
              y: isHovered ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center group-hover:bg-teal-600 dark:group-hover:bg-teal-600 transition-colors duration-200 shadow-md">
              <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-200" />
            </div>
          </motion.div>
        </div>

        {/* 描述 */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {link.description}
        </p>

        {/* 底部 */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 group/link">
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover/link:text-teal-500 flex-shrink-0 transition-colors duration-200" />
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 group-hover/link:text-gray-700 dark:group-hover/link:text-gray-300 truncate font-mono transition-colors duration-200">
              {hostname}
            </span>
          </div>

          {!link.isActive && (
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-800/50">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">
                未激活
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 底部高亮 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// 使用 React.memo 优化组件渲染性能
export const NavigationCard = memo(NavigationCardComponent);
