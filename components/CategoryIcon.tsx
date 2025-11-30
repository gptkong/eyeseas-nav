/**
 * CategoryIcon 组件
 *
 * 统一的分类图标渲染组件，支持：
 * - Emoji 图标
 * - Lucide 图标（使用 DynamicIcon 动态加载）
 */

"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { CategoryIconType } from "@/lib/types";

interface CategoryIconProps {
  icon?: string;
  iconType?: CategoryIconType;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const sizeMap = {
  sm: { lucide: 14, emoji: "text-sm" },
  md: { lucide: 18, emoji: "text-lg" },
  lg: { lucide: 22, emoji: "text-xl" },
  xl: { lucide: 28, emoji: "text-2xl" },
};

// PascalCase 转 kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

// 有效的 Lucide 图标名称集合（kebab-case 格式）
const VALID_LUCIDE_ICONS = new Set([
  // 文件/文档
  "folder", "folder-open", "file", "file-text", "files", "archive",
  "book-open", "book", "notebook",
  // 工作/办公
  "briefcase", "building", "building-2", "calendar", "clock", "mail",
  "inbox", "send",
  // 技术/开发
  "code", "code-2", "terminal", "database", "server", "cloud", "cpu",
  "hard-drive", "monitor", "smartphone",
  // 学习/教育
  "graduation-cap", "lightbulb", "brain", "flask-conical", "atom", "calculator",
  // 媒体/娱乐
  "music", "film", "image", "camera", "gamepad-2", "headphones", "radio", "tv",
  // 工具/设置
  "settings", "wrench", "hammer", "palette", "paintbrush", "pencil", "scissors",
  // 社交/通讯
  "message-circle", "message-square", "users", "user", "heart", "star", "thumbs-up",
  // 导航/位置
  "home", "map-pin", "navigation", "compass", "globe", "map",
  // 其他常用
  "search", "link", "bookmark", "tag", "flag", "award", "trophy", "zap",
  "rocket", "target", "shield", "lock", "key", "eye", "bell", "gift",
  "shopping-cart", "credit-card", "wallet", "dollar-sign", "trending-up",
  "bar-chart", "pie-chart", "activity",
]);

// 检查是否为有效的 Lucide 图标名称
function isValidLucideIcon(name: string): boolean {
  return VALID_LUCIDE_ICONS.has(name);
}

export function CategoryIcon({
  icon,
  iconType = "emoji",
  size = "md",
  className,
  fallback = "📁",
}: CategoryIconProps) {
  const sizeConfig = sizeMap[size];

  // 无图标时显示默认
  if (!icon) {
    return (
      <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
        {fallback}
      </span>
    );
  }

  // Lucide 图标 - 使用 DynamicIcon
  if (iconType === "lucide") {
    // 转换为 kebab-case 格式 (如 "FolderOpen" -> "folder-open")
    const iconName = toKebabCase(icon);

    // 验证图标名称是否有效，无效则回退到默认图标
    if (!isValidLucideIcon(iconName)) {
      return (
        <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
          {fallback}
        </span>
      );
    }

    return (
      <DynamicIcon
        name={iconName as IconName}
        size={sizeConfig.lucide}
        className={cn("flex-shrink-0", className)}
      />
    );
  }

  // Emoji 图标
  return (
    <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
      {icon}
    </span>
  );
}

// 导出常用图标列表，供 IconPicker 使用
export const SUGGESTED_LUCIDE_ICONS = [
  // 文件/文档
  "Folder",
  "FolderOpen",
  "File",
  "FileText",
  "Files",
  "Archive",
  "BookOpen",
  "Book",
  "Notebook",
  // 工作/办公
  "Briefcase",
  "Building",
  "Building2",
  "Calendar",
  "Clock",
  "Mail",
  "Inbox",
  "Send",
  // 技术/开发
  "Code",
  "Code2",
  "Terminal",
  "Database",
  "Server",
  "Cloud",
  "Cpu",
  "HardDrive",
  "Monitor",
  "Smartphone",
  // 学习/教育
  "GraduationCap",
  "Lightbulb",
  "Brain",
  "FlaskConical",
  "Atom",
  "Calculator",
  // 媒体/娱乐
  "Music",
  "Film",
  "Image",
  "Camera",
  "Gamepad2",
  "Headphones",
  "Radio",
  "Tv",
  // 工具/设置
  "Settings",
  "Wrench",
  "Hammer",
  "Palette",
  "Paintbrush",
  "Pencil",
  "Scissors",
  // 社交/通讯
  "MessageCircle",
  "MessageSquare",
  "Users",
  "User",
  "Heart",
  "Star",
  "ThumbsUp",
  // 导航/位置
  "Home",
  "MapPin",
  "Navigation",
  "Compass",
  "Globe",
  "Map",
  // 其他常用
  "Search",
  "Link",
  "Bookmark",
  "Tag",
  "Flag",
  "Award",
  "Trophy",
  "Zap",
  "Rocket",
  "Target",
  "Shield",
  "Lock",
  "Key",
  "Eye",
  "Bell",
  "Gift",
  "ShoppingCart",
  "CreditCard",
  "Wallet",
  "DollarSign",
  "TrendingUp",
  "BarChart",
  "PieChart",
  "Activity",
];

export const SUGGESTED_EMOJIS: Record<string, string[]> = {
  常用: ["📁", "📂", "📚", "💼", "🏠", "⭐", "❤️", "🔥", "✨", "💎"],
  工作: ["💻", "📊", "📈", "📝", "📋", "🗂️", "📎", "✉️", "📧", "🖥️"],
  学习: ["📖", "🎓", "💡", "🧠", "✏️", "📐", "🔬", "🧪", "📏", "🎯"],
  娱乐: ["🎮", "🎬", "🎵", "🎨", "📷", "🎧", "🎭", "🎪", "🎲", "🎳"],
  生活: ["🍕", "☕", "🏃", "🚗", "✈️", "🏖️", "🎉", "🎁", "🏡", "🛒"],
  工具: ["🔧", "⚙️", "🔨", "🔍", "🔐", "📌", "🏷️", "📦", "🗃️", "🔑"],
  自然: ["🌸", "🌿", "🌙", "☀️", "🌈", "⛰️", "🌊", "🔮", "💫", "🍀"],
  动物: ["🐱", "🐶", "🦊", "🐻", "🐼", "🦁", "🐯", "🦄", "🐬", "🦋"],
};

