"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, ExternalLink, Globe } from "lucide-react";
import { NavigationLink } from "@/lib/types";
import Image from "next/image";

interface LinksTableProps {
  links: NavigationLink[];
  isLoading: boolean;
  onEdit: (link: NavigationLink) => void;
  onDelete: (id: string) => void;
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
 */
function getAutoFaviconUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

/**
 * 单个链接图标组件
 */
const LinkIcon = memo(function LinkIcon({ link }: { link: NavigationLink }) {
  const [imageError, setImageError] = useState(false);
  const [autoFaviconError, setAutoFaviconError] = useState(false);
  
  // 获取自动 favicon URL
  const autoFaviconUrl = link.favicon ? null : (getAutoFaviconUrl(link.externalUrl) || getAutoFaviconUrl(link.internalUrl));
  
  // 如果有 emoji icon
  if (link.icon) {
    return <span className="text-2xl">{link.icon}</span>;
  }
  
  // 如果有设置 favicon 且没有加载错误
  if (link.favicon && !imageError) {
    return (
      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={link.favicon}
          alt=""
          width={32}
          height={32}
          className="object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // 尝试自动获取 favicon
  if (autoFaviconUrl && !autoFaviconError) {
    return (
      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={autoFaviconUrl}
          alt=""
          width={32}
          height={32}
          className="object-contain p-1"
          onError={() => setAutoFaviconError(true)}
          unoptimized
        />
      </div>
    );
  }
  
  // 默认图标
  return (
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <Globe className="w-4 h-4 text-gray-400" />
    </div>
  );
});

export const LinksTable = memo(function LinksTable({
  links,
  isLoading,
  onEdit,
  onDelete,
}: LinksTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                内网地址
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                外网地址
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : links.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  暂无链接数据
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <motion.tr
                  key={link.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <LinkIcon link={link} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{link.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {link.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <a
                      href={link.internalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-sm"
                    >
                      <span className="truncate max-w-xs">{link.internalUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <a
                      href={link.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-sm"
                    >
                      <span className="truncate max-w-xs">{link.externalUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        link.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {link.isActive ? "启用" : "禁用"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(link)}
                        className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(link.id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});
