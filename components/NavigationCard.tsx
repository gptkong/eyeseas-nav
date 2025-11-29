"use client";

import { NavigationLink } from "@/lib/types";
import { Globe, Building, AlertCircle, ArrowUpRight, Tag } from "lucide-react";
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

/**
 * 从 URL 中提取域名
 */
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * 获取自动 favicon URL
 * 优先使用 Google Favicon API，它支持更多网站和更好的图标质量
 */
function getAutoFaviconUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;
  // 使用 Google Favicon API 获取高质量图标
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

const NavigationCardComponent = ({ link, onClick, index = 0 }: NavigationCardProps) => {
  const { networkMode } = useNetworkMode();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [autoFaviconError, setAutoFaviconError] = useState(false);

  // 缓存当前 URL
  const currentUrl = useMemo(
    () => networkMode === "internal" ? link.internalUrl : link.externalUrl,
    [networkMode, link.internalUrl, link.externalUrl]
  );

  // 获取自动 favicon URL (当没有设置 favicon 时)
  const autoFaviconUrl = useMemo(() => {
    if (link.favicon) return null;
    // 优先使用外网地址获取 favicon，因为外网地址通常更稳定
    return getAutoFaviconUrl(link.externalUrl) || getAutoFaviconUrl(link.internalUrl);
  }, [link.favicon, link.externalUrl, link.internalUrl]);


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
              {/* 1. 优先使用用户设置的 favicon */}
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
              ) : /* 2. 如果没有设置 favicon，尝试自动获取 */
              autoFaviconUrl && !autoFaviconError ? (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/70 dark:ring-gray-600/70 bg-white/50 dark:bg-gray-700/50">
                  <Image
                    src={autoFaviconUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="object-contain p-2"
                    loading={index < 8 ? "eager" : "lazy"}
                    priority={index < 4}
                    onError={() => setAutoFaviconError(true)}
                    unoptimized
                  />
                </div>
              ) : (
                /* 3. 回退到默认图标 */
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
              x: isHovered ? 6 : 0,
              y: isHovered ? -6 : 0,
              rotate: isHovered ? 45 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <div className={cn(
              "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
              isHovered
                ? "bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
            )}>
              <ArrowUpRight className={cn(
                "w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 transition-colors duration-300",
                isHovered ? "text-white" : "text-gray-600 dark:text-gray-300"
              )} />
            </div>
          </motion.div>
        </div>

        {/* 描述 */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {link.description}
        </p>

        {/* 底部标签 */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
            {link.tags && link.tags.length > 0 ? (
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                {link.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 truncate max-w-[80px] sm:max-w-[100px] transition-colors duration-200 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-700 dark:group-hover:text-teal-300"
                  >
                    {tag}
                  </span>
                ))}
                {link.tags.length > 3 && (
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                    +{link.tags.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 italic">
                暂无标签
              </span>
            )}
          </div>

          {!link.isActive && (
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-800/50 flex-shrink-0">
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
